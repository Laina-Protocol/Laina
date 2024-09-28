import { useWallet } from 'src/stellar-wallet';
import { Button } from '../Button';
import { Card } from '../Card';
import Identicon from '../Identicon';
import AssetsModal from './AssetsModal';
import LoansModal from './LoansModal';

const ASSET_MODAL_ID = 'assets-modal';
const LOANS_MODAL_ID = 'loans-modal';

const WalletCard = () => {
  const { wallet, positions } = useWallet();

  const hasReceivables = Object.values(positions).some(({ receivables }) => receivables > 0n);
  const hasLiabilities = Object.values(positions).some(({ liabilities }) => liabilities > 0n);

  if (!wallet) {
    return (
      <Card bgColor="black" className="text-white p-6 mb-12 min-h-36 flex flex-col justify-center">
        <h2 className="text-xl font-semibold">My Account</h2>
        <p className="mt-2">To view your assets, connect a wallet first.</p>
      </Card>
    );
  }

  const openAssetModal = () => {
    const modalEl = document.getElementById(ASSET_MODAL_ID) as HTMLDialogElement;
    modalEl.showModal();
  };

  const closeAssetModal = () => {
    const modalEl = document.getElementById(ASSET_MODAL_ID) as HTMLDialogElement;
    modalEl.close();
  };

  const openLoansModal = () => {
    const modalEl = document.getElementById(LOANS_MODAL_ID) as HTMLDialogElement;
    modalEl.showModal();
  };

  const closeLoansModal = () => {
    const modalEl = document.getElementById(LOANS_MODAL_ID) as HTMLDialogElement;
    modalEl.close();
  };

  return (
    <>
      <Card bgColor="black" className="text-white p-6 mb-12 flex flex-row flex-wrap justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">My Account</h2>
          <div className="my-6 flex flex-row items-center">
            <Identicon address={wallet.address} />
            <div className="ml-9">
              <p className="text-xl">{wallet.displayName}</p>
              {/* TODO: Get wallet type from the kit. */}
              <p className="text-grey leading-tight">Freighter</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-9 my-auto items-end">
          {hasReceivables ? (
            <Button color="white" className="w-fit" onClick={openAssetModal}>
              View Assets
            </Button>
          ) : (
            <p>You haven't deposited any assets.</p>
          )}
          {hasLiabilities ? (
            <Button color="white" className="w-fit" onClick={openLoansModal}>
              View Loans
            </Button>
          ) : (
            <p>You haven't borrowed any assets.</p>
          )}
        </div>
      </Card>
      <AssetsModal modalId={ASSET_MODAL_ID} onClose={closeAssetModal} />
      <LoansModal modalId={LOANS_MODAL_ID} onClose={closeLoansModal} />
    </>
  );
};

export default WalletCard;
