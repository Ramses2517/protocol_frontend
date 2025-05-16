import TonWeb from "tonweb";

export const getTonAddress = ({ address, bounce }: { address: string, bounce: boolean }) => {
  return new TonWeb.utils.Address(address).toString(true, true, bounce);
};
