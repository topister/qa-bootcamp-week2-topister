type Employee = {
    readonly id: number;
    name: string;
    retire: (date: Date) => void;
};
let employee: Employee = {
    id: 1,
    name: "Topister",
    retire: (date: Date) => {
        console.log(`Employee ${employee.name} will retire on ${date.toDateString()}`);
    }
};

export { employee };