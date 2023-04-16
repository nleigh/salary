document.getElementById('calculateButton').addEventListener('click', function() {
  const grossSalary = parseFloat(document.getElementById('grossSalary').value);
  const netSalary = calculateNetSalary(grossSalary);

  // Calculate the 4-day workweek salary and take-home pay
  const reducedGrossSalary = grossSalary * 4 / 5;
  const reducedNetSalary = calculateNetSalary(reducedGrossSalary);

  const results = [
    { period: 'Yearly', value: netSalary, reducedValue: reducedNetSalary },
    { period: 'Monthly', value: netSalary / 12, reducedValue: reducedNetSalary / 12 },
    { period: 'Weekly', value: netSalary / 52, reducedValue: reducedNetSalary / 52 },
    { period: 'Daily', value: netSalary / 260, reducedValue: reducedNetSalary / 208 }, // 4 working days per week and 52 weeks per year
    { period: 'Hourly', value: netSalary / 2080, reducedValue: reducedNetSalary / 1664 } // Assumes 32 working hours per week and 52 weeks per year
  ];

  populateResultsTable(results);
});

function populateResultsTable(results) {
  const tableBody = document.getElementById('resultsTableBody');
  tableBody.innerHTML = '';

  results.forEach(result => {
    const row = document.createElement('tr');
    const periodCell = document.createElement('td');
    periodCell.innerText = result.period;
    row.appendChild(periodCell);

    const valueCell = document.createElement('td');
    valueCell.innerText = `£${result.value.toFixed(2)}`;
    row.appendChild(valueCell);

    const reducedValueCell = document.createElement('td');
    reducedValueCell.innerText = `£${result.reducedValue.toFixed(2)}`;
    row.appendChild(reducedValueCell);

    tableBody.appendChild(row);
  });
}


function calculateNetSalary(salary, personalAllowance = 12570) {
  let taxableIncome = salary - personalAllowance;
  let incomeTax = 0;

  if (taxableIncome > 0) {
    const basicRate = 0.2;      // 20% tax rate
    const higherRate = 0.4;     // 40% tax rate
    const additionalRate = 0.45; // 45% tax rate

    const basicThreshold = 37500;
    const higherThreshold = 112570 - personalAllowance;

    if (taxableIncome <= basicThreshold) {
      incomeTax = taxableIncome * basicRate;
    } else if (taxableIncome <= higherThreshold) {
      incomeTax = basicThreshold * basicRate + (taxableIncome - basicThreshold) * higherRate;
    } else {
      incomeTax = basicThreshold * basicRate + (higherThreshold - basicThreshold) * higherRate + (taxableIncome - higherThreshold) * additionalRate;
    }
  }

  // National Insurance calculations
  const weeklySalary = salary / 52;
  const primaryThreshold = 184;
  const upperEarningsLimit = 967;
  const niRate1 = 0.12;
  const niRate2 = 0.02;

  let niContribution = 0;

  if (weeklySalary > primaryThreshold) {
    if (weeklySalary <= upperEarningsLimit) {
      niContribution = (weeklySalary - primaryThreshold) * niRate1;
    } else {
      niContribution = (upperEarningsLimit - primaryThreshold) * niRate1 + (weeklySalary - upperEarningsLimit) * niRate2;
    }
  }

  const annualNiContribution = niContribution * 52;
  const netSalary = salary - incomeTax - annualNiContribution;

  return netSalary;
}