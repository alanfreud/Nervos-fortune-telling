/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import './app.scss';
import 'react-toastify/dist/ReactToastify.css';
import { PolyjuiceHttpProvider } from '@polyjuice-provider/web3';
import { AddressTranslator } from 'nervos-godwoken-integration';

import { FortuneWrapper } from '../lib/contracts/FortuneWrapper';
import { CONFIG } from '../config';
import Fortune from './components/fortune';
import CreateFortune from './components/createFortune';
import { IFortune } from '../types/root';
import ShowFortunes from './components/showFortunes';

async function createWeb3() {
    // Modern dapp browsers...
    if ((window as any).ethereum) {
        const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
        const providerConfig = {
            rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
            ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
            web3Url: godwokenRpcUrl
        };

        const provider = new PolyjuiceHttpProvider(godwokenRpcUrl, providerConfig);
        const web3 = new Web3(provider || Web3.givenProvider);

        try {
            // Request account access if needed
            await (window as any).ethereum.enable();
        } catch (error) {
            // User denied account access...
        }

        return web3;
    }

    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    return null;
}

export function App() {
    const [web3, setWeb3] = useState<Web3>(null);
    const [contract, setContract] = useState<FortuneWrapper>();
    const [accounts, setAccounts] = useState<string[]>();
    const [l2Balance, setL2Balance] = useState<bigint>();
    const [polyjuiceAddress, setPolyjuiceAddress] = useState<string | undefined>();
    const [transactionInProgress, setTransactionInProgress] = useState(false);
    const toastId = React.useRef(null);

    const [newFortuneText, setNewFortuneText] = useState<string>();
    const [fortunes, setFortunes] = useState<IFortune[]>();
    const [clicked, setClicked] = useState<number>(0);
    const [totalFortune, setTotalFortune] = useState<number>(0);
    const [cookiesLoading, setCookiesLoading] = useState<boolean>(false);
    useEffect(() => {
        if (accounts?.[0]) {
            const addressTranslator = new AddressTranslator();
            setPolyjuiceAddress(addressTranslator.ethAddressToGodwokenShortAddress(accounts?.[0]));
        } else {
            setPolyjuiceAddress(undefined);
        }
    }, [accounts?.[0]]);

    useEffect(() => {
        if (contract && accounts) {
            getAllFortunes();
        }
    }, [contract, accounts]);
    useEffect(() => {
        if (transactionInProgress && !toastId.current) {
            toastId.current = toast.info(
                'Transaction in progress. Confirm MetaMask signing dialog and please wait...',
                {
                    position: 'top-right',
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    closeButton: false
                }
            );
        } else if (!transactionInProgress && toastId.current) {
            toast.dismiss(toastId.current);
            toastId.current = null;
        }
    }, [transactionInProgress, toastId.current]);

    const account = accounts?.[0];

    const onNewFortuneText = (e: any) => {
        const _text = e.target.value;

        setNewFortuneText(_text);
    };

    const getTotalFortune = async () => {
        const total = await contract.getTotalFortunes(account);
        return total;
    };

    const getAllFortunes = async () => {
        setCookiesLoading(true);
        const _fortunes = [];
        const _totalFortune = await getTotalFortune();
        setTotalFortune(_totalFortune);

        for (let i = 1; i <= _totalFortune; i++) {
            const _fortune = await getSingleFortune(i);
            _fortunes.push(_fortune);
        }
        setFortunes(_fortunes);
        toast('🍪 Cookies are ready to fortune telling. Click them', { type: 'success' });
        setCookiesLoading(false);
    };

    const getSingleFortune = async (_id: number) => {
        try {
            const _fortune = await contract.getSingleFortune(_id, accounts?.[0]);
            const newFortune = { id: _fortune.id, text: _fortune.text };

            return newFortune;
        } catch (error) {
            console.log('💢 single fortune error', error);
            return { id: '0', text: '' };
        }
    };

    const createNewFortune = async () => {
        try {
            setTransactionInProgress(true);
            await contract.createFortune(newFortuneText, account);
            toast('🥠 Your fortune is created', { type: 'success' });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error(
                'There was an error sending your transaction. Please check developer console.'
            );
        } finally {
            setTransactionInProgress(false);
        }
    };

    useEffect(() => {
        if (web3) {
            return;
        }

        (async () => {
            const _web3 = await createWeb3();
            setWeb3(_web3);

            const _accounts = [(window as any).ethereum.selectedAddress];
            setAccounts(_accounts);
            console.log({ _accounts });

            const _contract = new FortuneWrapper(_web3);
            setContract(_contract);

            if (_accounts && _accounts[0]) {
                const _l2Balance = BigInt(await _web3.eth.getBalance(_accounts[0]));
                setL2Balance(_l2Balance);
            }
        })();
    });

    const LoadingIndicator = () => <span className="rotating-icon">⚙️</span>;

    return (
        <div className="root">
            <h1> 🍪 Nervos Fortune Telling Cookies 🍪 </h1>
            <hr />
            Your ETH address: <b>{accounts?.[0]}</b>
            <br />
            <br />
            Your Polyjuice address: <b>{polyjuiceAddress || ' - '}</b>
            <br />
            <br />
            Nervos Layer 2 balance:{' '}
            <b>{l2Balance ? (l2Balance / 10n ** 8n).toString() : <LoadingIndicator />} CKB</b>
            <br />
            <br />
            <CreateFortune onFortuneChange={onNewFortuneText} createNewFortune={createNewFortune} />
            <ShowFortunes
                fortunes={fortunes}
                loading={cookiesLoading}
                totalFortune={totalFortune}
            />
            <ToastContainer />
        </div>
    );
}
