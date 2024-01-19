const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Contract1 Test", async function () {
	const ZERO = 0;
	const mintAmount1 = 100 * 1e6;
	const mintAmount2 = 200 * 1e6;
	const startTime = 24 * 3600; // start depositing after 1 day
	const endTime = startTime + (3 * 30 * 24 * 3600); // end after 3 months 
	const lockPeriod = 14 * 24 * 3600; // locked 14 days

	const increaseTime = async (seconds) => {
		await network.provider.send("evm_increaseTime", [seconds]);
		await network.provider.send("evm_mine");
	}

	before(async () => {
		[owner] = await ethers.getSigners();

		Token = await ethers.getContractFactory("SemmiToken");
		token1 = await Token.connect(owner).deploy();
		token2 = await Token.connect(owner).deploy();

		Contract = await ethers.getContractFactory("Contract1");
		contract = await Contract.connect(owner).deploy(startTime, endTime, lockPeriod);
	});

	it('Mint Token', async () => {
		await token1.connect(owner).mint(mintAmount1);
		await token2.connect(owner).mint(mintAmount2);
	});

	it("Test Deposit", async () => {
		// deposit token1
		expect(await token1.balanceOf(contract.target)).to.equal(
			ZERO
		);
		await token1.connect(owner).approve(contract.target, mintAmount1);
		await contract.connect(owner).deposit(token1.target, mintAmount1);
		expect(await token1.balanceOf(contract.target)).to.equal(
			mintAmount1
		);

		// deposit token2
		expect(await token2.balanceOf(contract.target)).to.equal(
			ZERO
		);
		await token2.connect(owner).approve(contract.target, mintAmount2);
		await contract.connect(owner).deposit(token2.target, mintAmount2);
		expect(await token2.balanceOf(contract.target)).to.equal(
			mintAmount2
		);
	})

	it("Test Claim", async () => {
		await expect(contract.connect(owner).claim(token1.target)).to.be.revertedWith("Locked.");

		// claim token1
		await increaseTime(lockPeriod);

		expect(await token1.balanceOf(owner.address)).to.equal(
			ZERO
		);
		await contract.connect(owner).claim(token1.target);
		expect(await token1.balanceOf(owner.address)).to.above(
			ZERO
		);

		// claim token1 & token2 after long times
		await increaseTime(endTime);

		// for token1
		await contract.connect(owner).claim(token1.target);
		expect(await token1.balanceOf(owner.address)).to.equal(
			mintAmount1
		);

		// for token2
		expect(await token2.balanceOf(owner.address)).to.equal(
			ZERO
		);
		await contract.connect(owner).claim(token2.target);
		expect(await token2.balanceOf(owner.address)).to.equal(
			mintAmount2
		);
	})

	it("Test Deposit after started", async () => {
		await expect(contract.connect(owner).deposit(token1.target, mintAmount1)).to.be.revertedWith("Already started.");
	})
});
