import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../model/employee';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
@Component({
  selector: 'app-employee-component',
  templateUrl: './employee-component.component.html',
  styleUrls: ['./employee-component.component.css']
})
export class EmployeeComponentComponent implements OnInit {

  employees : any;
   chartOptions:any;
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
       
        const dataPoints = this.employees.map((employee: { EmployeeName: any; TotalTimeWorked: any; }) => ({
          y: employee.TotalTimeWorked,
          name: employee.EmployeeName
        }));

        this.chartOptions = {
          animationEnabled: true,
          title: {
            text: "Employees by hours worked"
          },
          data: [{
            type: "pie",
            startAngle: -90,
            indexLabel: "{name}: {y}",
            yValueFormatString: "#,###.##'%'",
            dataPoints: dataPoints
          }]
        };
      },
      error => {
        console.error('Error fetching time entries:', error);
      }
    );
  }
  
 /* chartOptions = {
	  animationEnabled: true,
	  title: {
		text: "Employees by hours worked"
	  },
	  data: [{
		type: "pie",
		startAngle: -90,
		indexLabel: "{name}: {y}",
		yValueFormatString: "#,###.##'%'",
		dataPoints: [
		  { y: 14.1, name: "Toys" },
		  { y: 28.2, name: "Electronics" },
		  { y: 14.4, name: "Groceries" },
		  { y: 43.3, name: "Furniture" }
		]
	  }]
	}*/
  getHoursWorked( startTime:Date, endTime : Date):number{
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60); 
  }

}
