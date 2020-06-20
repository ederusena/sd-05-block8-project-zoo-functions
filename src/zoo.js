/*
eslint no-unused-vars: [
  "error",
  {
    "args": "none",
    "vars": "local",
    "varsIgnorePattern": "data"
  }
]
*/

const data = require('./data');

const { animals, employees, prices, hours } = data;

function animalsByIds(...ids) {
  const animalsById = [];
  ids.forEach(id =>
    animalsById.push(...animals.filter(animal => animal.id === id)),
  );
  return animalsById;
}

function animalsOlderThan(animalName, age) {
  return animals
    .find(animal => animal.name === animalName)
    .residents.every(animal => animal.age > age);
}

function employeeByName(employeeName) {
  if (employeeName === undefined) return {};
  return employees.find(
    employee =>
      employee.firstName === employeeName || employee.lastName === employeeName,
  );
}

function createEmployee(personalInfo, associatedWith) {
  return { ...personalInfo, ...associatedWith };
}

function isManager(id) {
  return employees.some(
    employee => id === employee.managers.find(item => item === id),
  );
}

function addEmployee(
  id,
  firstName,
  lastName,
  managers = [],
  responsibleFor = [],
) {
  return employees.push({ id, firstName, lastName, managers, responsibleFor });
}

function animalCount(species) {
  const listaCompleta = (lista, { name, residents }) => {
    lista[name] = residents.length;
    return lista;
  };
  return species
    ? animals.find(animal => animal.name === species).residents.length
    : animals.reduce(listaCompleta, {});
}

//   const entrants = { 'Adult': 2, 'Child': 3, 'Senior': 1 };
function entryCalculator(entrants) {
  if (entrants === undefined || Object.entries(entrants).length === 0) return 0;
  // prettier-ignore
  const totalPrice = (total, priceByAge) =>
    total + (prices[priceByAge] * entrants[priceByAge]);
  return Object.keys(prices).reduce(totalPrice, 0);
}

const animalsName = (nameOfAnimal, sorted, sex) => {
  const obj = {};
  obj[nameOfAnimal] = animals.find(
    element => element.name === nameOfAnimal,
  ).residents;
  if (sex) {
    obj[nameOfAnimal] = obj[nameOfAnimal].filter(
      resident => resident.sex === sex,
    );
  }
  obj[nameOfAnimal] = obj[nameOfAnimal].map(({ name }) => name);
  if (sorted) obj[nameOfAnimal].sort();
  return obj;
};

const animalMap = (options = {}) => {
  const { includeNames, sex, sorted } = options;
  const mappedAnimal = animals.reduce((animal, { name, location }) => {
    if (!animal[location]) animal[location] = [];
    if (includeNames) {
      animal[location].push(animalsName(name, sorted, sex));
    } else {
      animal[location].push(name);
    }
    return animal;
  }, {});
  return mappedAnimal;
};

// prettier-ignore
const setSchedule = () =>
  Object.keys(hours).forEach((dayValue) => {
    if (hours[dayValue].open > 0) {
      hours[dayValue] = `Open from ${hours[dayValue].open}am until ${
        hours[dayValue].close - 12
      }pm`;
    } else hours[dayValue] = 'CLOSED';
    return hours[dayValue];
  });

function schedule(dayName) {
  if (hours.Monday !== 'CLOSED') {
    setSchedule();
  }
  if (!dayName) return hours;
  let day = {};
  const selectedDay = Object.keys(hours);
  // prettier-ignore
  selectedDay.forEach((days) => {
    if (days === dayName) day = { [dayName]: hours[dayName] };
  });
  return day;
}

const findOldestAnimal = (old, older) => (old.age > older.age ? old : older);

function oldestFromFirstSpecies(id) {
  const selectedEmployee = employees.find(employee => employee.id === id);
  const specieId = selectedEmployee.responsibleFor[0];
  const selectedAnimal = animals.find(animal => animal.id === specieId)
    .residents;
  const oldestAnimal = selectedAnimal.reduce(findOldestAnimal);
  const result = [];
  Object.values(oldestAnimal).forEach(key => result.push(key));
  return result;
}

function roundNum(num, length) {
  // prettier-ignore
  const number = Math.round(num * (10 ** length)) / (10 ** length);
  return number;
}

function increasePrices(percentage) {
  // prettier-ignore
  return Object.keys(prices).forEach(
    key =>
      (prices[key] = roundNum(
        prices[key] + (prices[key] * (percentage / 100)),
        2,
      )),
  );
}

// prettier-ignore
const arrayPush = (param) => {
  const array = [];
  param.responsibleFor.forEach(employId =>
    array.push(animals.find(animal => animal.id === employId).name),
  );
  return array;
};

// prettier-ignore
const singleEmployee = (id) => {
  const selectedEmployee = employees.find(
    employee =>
      id === employee.id ||
      id === employee.lastName ||
      id === employee.firstName,
  );
  const selectedEmployeeName = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`;
  const animalsArray = arrayPush(selectedEmployee);
  return { [selectedEmployeeName]: animalsArray };
};

function employeeCoverage(idOrName) {
  if (idOrName) {
    return singleEmployee(idOrName);
  }
  const allEmployeeObj = {};
  // prettier-ignore
  employees.forEach((employee) => {
    const allEmployeeArr = arrayPush(employee);
    const employeeName = `${employee.firstName} ${employee.lastName}`;
    allEmployeeObj[employeeName] = allEmployeeArr;
  });
  return allEmployeeObj;
}

module.exports = {
  entryCalculator,
  schedule,
  animalCount,
  animalMap,
  animalsByIds,
  employeeByName,
  employeeCoverage,
  addEmployee,
  isManager,
  animalsOlderThan,
  oldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
