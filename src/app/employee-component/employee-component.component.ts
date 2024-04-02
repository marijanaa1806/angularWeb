import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../model/employee';

@Component({
  selector: 'app-employee-component',
  templateUrl: './employee-component.component.html',
  styleUrls: ['./employee-component.component.css']
})
export class EmployeeComponentComponent implements OnInit {

  employees : any;
  constructor(private empService : EmployeeService) { }

  ngOnInit(): void {
    this.empService.getTimeEntries().subscribe(
      data => {
        const totalTimeWorkedMap = new Map<string, number>();
        data.forEach((entry: Employee) => {
          const totalTime = this.getHoursWorked(entry.StarTimeUtc, entry.EndTimeUtc);
          if (totalTimeWorkedMap.has(entry.EmployeeName)) {
            totalTimeWorkedMap.set(entry.EmployeeName, totalTimeWorkedMap.get(entry.EmployeeName)! + totalTime);
          } else {
            totalTimeWorkedMap.set(entry.EmployeeName, totalTime);
          }
        });

        this.employees = Array.from(totalTimeWorkedMap.entries()).map(([name, totalTime]) => ({
          EmployeeName: name,
          TotalTimeWorked: totalTime
        }));

        this.employees.sort((a: any, b: any) => a.TotalTimeWorked - b.TotalTimeWorked);
      },
      error => {
        console.error('Error fetching time entries:', error);
      }
    );
  }

  getHoursWorked( startTime:Date, endTime : Date):number{
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60); 
  }

}
