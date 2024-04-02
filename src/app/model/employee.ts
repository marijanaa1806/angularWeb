export class Employee {
    Id!: string;
    EmployeeName!: string;
    StarTimeUtc!: Date; 
    EndTimeUtc!: Date;
    EntryNotes!: string;
    DeletedOn!: string;
    totalTimeWorked?: number; 
}
