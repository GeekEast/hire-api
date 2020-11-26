import faker from 'faker';

export const generateSampleData = () => {
  const coffees = [];

  for (let id = 0; id < 2000; id++) {
    const name = faker.name.findName();
    const brand = faker.company.companyName();
    const flavors = [];
    for (let y = 0; y < 3; y++) {
      flavors.push(faker.phone.phoneNumber());
    }
    coffees.push({ id, name, brand, flavors });
  }

  return coffees;
};
