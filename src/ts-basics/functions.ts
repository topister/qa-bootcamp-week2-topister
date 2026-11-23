function calculateTax(income:number, taxYear:number):number{
    if (taxYear < 2022) return income * 1.2;
    return income * 1.0;
}
console.log(calculateTax(300000, 2022));
console.log(calculateTax(300000, 2021));
console.log(calculateTax(300000, 2026));