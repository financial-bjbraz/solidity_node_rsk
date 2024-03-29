const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContract } = require("./test-util/test-util.js");

describe("Cars - state machine", () => {
  let accounts;
  let superHonk;
  let cars;

  before(async () => {
    accounts = await ethers.getSigners();
    superHonk = await deployContract("SuperHonk");
    cars = await deployContract("Cars", superHonk.address);
  });

  it("should add a new car", async () => {
    // siulate state transition, without it actually ocurring
    const returnValue = await cars.connect(accounts[1]).callStatic.addCar(
      "0xff00ff", // colour: purple
      4, // doors: 4
      {
        value: ethers.utils.parseEther("1.1"),
      }
    );
    expect(returnValue).to.equal(1);

    // perform the state transition
    const tx = await cars.connect(accounts[1]).functions.addCar(
      "0xff00ff", // colour: purple
      4, // doors: 4
      {
        value: ethers.utils.parseEther("1.1"),
      }
    );

    // retrieve updated state
    const numCars = await cars.callStatic.numCars();
    const car1 = await cars.callStatic.cars(1);
    console.log(car1);

    // perform assertionns on car1
    expect(numCars).to.equal(1);
    expect(car1.colour).to.equal("0xff00ff");
    expect(car1.doors).to.equal(4);
    expect(car1.status).to.equal(1); // CarStatus.Parked
    expect(car1.owner).to.equal(accounts[1].address);
  });
});
