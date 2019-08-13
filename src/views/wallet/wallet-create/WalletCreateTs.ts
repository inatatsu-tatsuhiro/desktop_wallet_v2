
import {NetworkType} from "nem2-sdk"
import {localRead} from '@/help/help'
import {Message} from "@/config/index"
import {MnemonicPassPhrase} from 'nem2-hd-wallets'
import {Component, Vue} from 'vue-property-decorator'

@Component
export class WalletCreateTs extends Vue {
    formItem = {
        currentNetType: '',
        walletName: '',
        password: '',
        checkPW: '',
    }
    netType = [
        {
            value: NetworkType.MIJIN_TEST,
            label: 'MIJIN_TEST'
        }, {
            value: NetworkType.MAIN_NET,
            label: 'MAIN_NET'
        }, {
            value: NetworkType.TEST_NET,
            label: 'TEST_NET'
        }, {
            value: NetworkType.MIJIN,
            label: 'MIJIN'
        },
    ]

    checkInput() {
        if (!this.formItem.currentNetType || this.formItem.currentNetType == '') {
            this.$Notice.error({title: this.$t(Message.PLEASE_SWITCH_NETWORK) + ''});
            return false
        }
        if (!this.formItem.walletName || this.formItem.walletName == '') {
            this.$Notice.error({title: this.$t(Message.WALLET_NAME_INPUT_ERROR) + ''});
            return false
        }
        if (!this.formItem.password || this.formItem.password == '') {
            this.$Notice.error({title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''});
            return false
        }
        if (this.formItem.password !== this.formItem.checkPW) {
            this.$Notice.error({title: this.$t(Message.INCONSISTENT_PASSWORD_ERROR) + ''});
            return false
        }
        return true
    }

    createMnemonic() {
        const mnemonic = MnemonicPassPhrase.createRandom('english', 128);
        this.$store.commit('SET_MNEMONIC', mnemonic.plain)
    }

    createWallet() {
        if (!this.checkInput()) return
        this.createMnemonic()
        this.$emit('isCreated', this.formItem)
    }

    toBack() {
        this.$emit('closeCreate')
    }

    created() {
        const wallets = localRead('wallets')
        let list = wallets ? JSON.parse(wallets) : []
        if (list.length < 1) {
            this.$store.state.app.isInLoginPage = true
        }
    }
}