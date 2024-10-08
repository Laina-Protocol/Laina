import { Button } from '@components/Button';
import { Loading } from '@components/Loading';
import { type ChangeEvent, useState } from 'react';
import type { CurrencyBinding } from 'src/currency-bindings';
import { to7decimals } from 'src/lib/converters';
import { useWallet } from 'src/stellar-wallet';

export interface DepositModalProps {
  modalId: string;
  onClose: () => void;
  currency: CurrencyBinding;
}

export const DepositModal = ({ modalId, onClose, currency }: DepositModalProps) => {
  const { contractClient, name, ticker } = currency;

  const { wallet, walletBalances, signTransaction, refetchBalances } = useWallet();
  const [isDepositing, setIsDepositing] = useState(false);
  const [amount, setAmount] = useState('0');

  const balance = walletBalances[ticker];

  if (!balance) return null;

  const closeModal = () => {
    refetchBalances();
    setAmount('0');
    onClose();
  };

  const handleDepositClick = async () => {
    if (!wallet) {
      alert('Please connect your wallet first!');
      return;
    }

    setIsDepositing(true);

    contractClient.options.publicKey = wallet.address;

    const tx = await contractClient.deposit({
      user: wallet.address,
      amount: to7decimals(amount),
    });

    try {
      const { result } = await tx.signAndSend({ signTransaction });
      alert(`Deposit successful, result: ${result}`);
      closeModal();
    } catch (err) {
      console.error('Error depositing', err);
      alert('Error depositing');
    }
    setIsDepositing(false);
  };

  const handleAmountChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setAmount(ev.target.value);
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-8">Deposit {name}</h3>

        <div className="flex flex-row items-center">
          <div className="w-full">
            <p className="text-lg mb-2">Amount to deposit</p>
            <input
              type="range"
              min={0}
              max={balance.balance}
              value={amount}
              className="range"
              onChange={handleAmountChange}
            />
            <div className="flex w-full justify-between px-2 text-xs">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
          </div>
        </div>

        <p>
          {amount} {ticker} out of {balance.balance} {ticker}
        </p>

        <div className="flex flex-row justify-end mt-8">
          <Button onClick={closeModal} color="ghost" className="mr-4">
            Cancel
          </Button>
          {!isDepositing ? (
            <Button disabled={amount === '0'} onClick={handleDepositClick}>
              Deposit
            </Button>
          ) : (
            <Button disabled>
              <Loading />
              Depositing
            </Button>
          )}
        </div>
      </div>
      {/* Invisible backdrop that closes the modal on click */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal} type="button">
          close
        </button>
      </form>
    </dialog>
  );
};
