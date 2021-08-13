import Web3 from 'web3';
import * as FortuneJSON from '../../../build/contracts/Fortune.json';
import { Fortune } from '../../types/Fortune';

const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};

const FORTUNE_ADDRESS = '0x286adFEEE1d5e91B12F644c672D499BBdB42197e';

export class FortuneWrapper {
    web3: Web3;

    contract: Fortune;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.address = FORTUNE_ADDRESS;
        this.contract = new web3.eth.Contract(FortuneJSON.abi as any) as any;
        this.contract.options.address = FORTUNE_ADDRESS;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async getTotalFortunes(fromAddress: string) {
        const data = await this.contract.methods.totalFortune().call({ from: fromAddress });

        return parseInt(data, 10);
    }

    async getSingleFortune(_id: number, fromAddress: string) {
        const fortune = await this.contract.methods
            .fortunes(_id)
            .call({ ...DEFAULT_SEND_OPTIONS, from: fromAddress });

        return fortune;
    }

    async createFortune(text: string, fromAddress: string) {
        const tx = await this.contract.methods.createFortune(text).send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress
        });

        return tx;
    }
}
