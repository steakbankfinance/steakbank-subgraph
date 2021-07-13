import { BigInt } from "@graphprotocol/graph-ts";
import {
  ClaimedUnStaker,
  Record,
  LogUnStaker,
  StakeMarket,
} from "../generated/schema";
import {
  ClaimedUnstake,
  LogUnstake,
  LogUpdateLBNBToBNBExchangeRate,
} from "../generated/SteakBank/SteakBank";

export function handleClaimedUnstake(event: ClaimedUnstake): void {
  let unStaker = ClaimedUnStaker.load(event.params.staker.toHexString());
  if (unStaker === null) {
    unStaker = new ClaimedUnStaker(event.params.staker.toHexString());
    unStaker.data = [];
  }

  let data = unStaker.data;
  let record = new Record(
    event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(BigInt.fromI32(data.length).toString())
  );

  record.bnbAmount = event.params.amount;
  record.lbnbAmount = BigInt.fromI32(0);
  record.timestamp = event.block.timestamp;
  record.index = event.params.index;
  record.save();
  unStaker.data = data.concat([record.id]);
  unStaker.save();
}

export function handleLogUnstake(event: LogUnstake): void {
  let unStaker = LogUnStaker.load(event.params.staker.toHexString());
  if (unStaker === null) {
    unStaker = new LogUnStaker(event.params.staker.toHexString());
    unStaker.data = [];
  }

  let data = unStaker.data;
  let record = new Record(
    event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(BigInt.fromI32(data.length).toString())
  );

  record.bnbAmount = event.params.bnbAmount;
  record.lbnbAmount = event.params.lbnbAmount;
  record.timestamp = event.block.timestamp;
  record.index = event.params.index;
  record.save();
  unStaker.data = data.concat([record.id]);
  unStaker.save();
}

export function handleLogUpdateLBNBToBNBExchangeRate(
  event: LogUpdateLBNBToBNBExchangeRate
): void {
  const stakeMarket = new StakeMarket(
    event.transaction.hash
      .toHexString()
      .concat(event.params.LBNBTotalSupply.toHexString())
  );
  stakeMarket.timestamp = event.block.timestamp;
  stakeMarket.lBNBToBNBExchangeRate = event.params.LBNBToBNBExchangeRate;
  stakeMarket.lbnbTotalSupply = event.params.LBNBTotalSupply;
  stakeMarket.save();
}
