const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const Token = artifacts.require("ERC20Token.sol");

contract("ERC20Token", (accounts) => {
  let token;
  const initialBalance = web3.utils.toBN(web3.utils.toWei("1"));
  const [sender, receiver] = [accounts[1], accounts[2]];
  beforeEach(async () => {
    token = await Token.new("GreaseCoin", "GCN", 18, initialBalance);
  });

  it("should not transfer if the sender's balance is less than the value", async () => {
    await token.transfer(sender, web3.utils.toBN(50));
    const senderBalance = await token.balances(sender);
    await expectRevert(
      token.transfer(receiver, web3.utils.toBN(100), { from: sender }),
      "balance too low"
    );
    assert(senderBalance.toNumber() === 50);
  });
  it("should transfer", async () => {
    await token.transfer(sender, web3.utils.toBN(100));
    const balance = await token.balances(sender);
    assert(balance.toNumber() === 100);
  });
  it("should emit event after transfer", async () => {
    const transfer = await token.transfer(sender, web3.utils.toBN(100));
    await expectEvent(transfer, "Transfer", {
      from: accounts[0],
      to: sender,
      tokens: "100",
    });
    const balance = await token.balances(sender);
    assert(balance.toNumber() === 100);
  });
  it("should not transferFrom one address to another if sender's allowance are less than value", async () => {
    const transfer = web3.utils.toBN(100);
    await token.approve(sender, transfer);
    await expectRevert(
      token.transferFrom(accounts[0], receiver, web3.utils.toBN(150), {
        from: sender,
      }),
      "allowance too low"
    );
  });

  it("should transferFrom one address to another", async () => {
    const transfer = web3.utils.toBN(100);
    await token.transfer(sender, transfer);
    await token.approve(sender, transfer);
    await token.transferFrom(accounts[0], receiver, transfer, { from: sender });
    const balance = await token.balanceOf(receiver);
    assert(balance.eq(transfer));
  });
  it("should emit event for transferFrom", async () => {
    const transfer = web3.utils.toBN(100);
    const tx = await token.transfer(sender, transfer);
    const approve = await token.approve(sender, transfer);
    const transferFrom = await token.transferFrom(
      accounts[0],
      receiver,
      transfer,
      {
        from: sender,
      }
    );
    const balance = await token.balanceOf(receiver);
    assert(balance.eq(transfer));
    await expectEvent(tx, "Transfer", {
      from: accounts[0],
      to: sender,
      tokens: "100",
    });
    await expectEvent(approve, "Approval", {
      tokenOwner: accounts[0],
      spender: sender,
      tokens: "100",
    });
    await expectEvent(transferFrom, "Transfer", {
      from: sender,
      to: receiver,
      tokens: "100",
    });
  });
  it("should not transfer token if not approved", async () => {
    await expectRevert(
      token.transferFrom(accounts[0], receiver, web3.utils.toBN(100), {
        from: sender,
      }),
      "allowance too low"
    );
  });
  it("should display user's allowance", async () => {
    await token.approve(sender, web3.utils.toBN(100), { from: accounts[0] });
    await token.allowance(accounts[0], sender);
  });
  it("should display correct balance", async () => {
    const balance = await token.balanceOf(accounts[0]);
    assert(balance.eq(initialBalance));
  });

  it("should display total supply", async () => {
    const totalSupply = await token.totalSupply();
    assert(totalSupply.eq(initialBalance));
  });
});
