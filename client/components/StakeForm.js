import React from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import StakingAbi from '../constants/Staking.json';
import TokenAbi from '../constants/RewardToken.json';
import { Form } from 'web3uikit';
import { ethers } from 'ethers';

function StakeForm() {
  const stakingAddress = "0x3241eEdd84E59761154fc83b6151694D1c91C302"; //replace this with the address where you have deployed your staking Smart Contract
  const tesTokenAddress = "0xE6bD05B573128Ccd6934AC685E96F20a88e79471"; //replace this with the address where you have deployed your Reward Token Smart Contract

  const { runContractFunction } = useWeb3Contract();

  let approveOptions = {
    abi: TokenAbi.abi,
    contractAddress: tesTokenAddress,
    functionName: 'approve'
  };

  let stakeOptions = {
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: 'stake'
  };

  async function handleStakeSubmit(data) {
    const amountToApprove = data.data[0].inputResult;
    approveOptions.params = {
      amount: ethers.utils.parseEther(amountToApprove, 'ether'),
      spender: stakingAddress
    };
   

    const tx = await runContractFunction({
      params: approveOptions,
      onError: (error) => console.log(error),
      onSuccess: () => {
        handleApproveSuccess(approveOptions.params.amount);
      }
    });
  }

  async function handleApproveSuccess(amountToStakeFormatted) {
    stakeOptions.params = {
      amount: amountToStakeFormatted
    };

    const tx = await runContractFunction({
      params: stakeOptions,
      onError: (error) => console.log(error)
    });

    await tx.wait(0);
    console.log('Stake transaction complete');
  }

let withdrawOptions = {
  abi: StakingAbi.abi,
  contractAddress: stakingAddress,
  functionName: "withdraw",
};

async function handleWithdrawSubmit(data) {
  const withdrawAmount = data.data[0].inputResult;
  approveOptions.params = {
    amount: ethers.utils.parseEther(withdrawAmount, "ether"),
    spender: stakingAddress,
  };

  const tx = await runContractFunction({
    params: approveOptions,
    onError: (error) => console.log(error),
    onSuccess: () => {
      handleApproveSuccess(approveOptions.params.amount);
    },
  });

  async function handleApproveSuccess(withdrawAmount) {
    withdrawOptions.params = {
      amount: withdrawAmount,
    };

    const tx = await runContractFunction({
      params: withdrawOptions,
      onError: (error) => console.log(error),
    });

    await tx.wait(0);
    console.log("Withdraw transaction complete");
  }
}


 

  return (
    <div className='text-black'>
      <Form
        onSubmit={handleStakeSubmit}
        data={[
          {
            inputWidth: '50%',
            name: 'Amount to stake ',
            type: 'number',
            value: '',
            key: 'amountToStake'
          }
        ]}
        title="Stake Now!"
      ></Form>
      <br></br>
      <Form
        onSubmit={handleWithdrawSubmit}
        data={[
          {
            inputWidth: '50%',
            name: 'Amount to widthdraw ',
            type: 'number',
            value: '',
            key: 'amountToStake'
          }
        ]}
        title="Widthdraw now !"
      ></Form>
    </div>
  );
}

export default StakeForm;
