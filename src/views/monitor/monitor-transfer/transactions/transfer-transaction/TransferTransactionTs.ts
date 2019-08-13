import {Message} from "@/config/index"
import {mosaicInterface} from '@/interface/sdkMosaic'
import {accountInterface} from '@/interface/sdkAccount'
import { Account, Mosaic, MosaicId, UInt64} from 'nem2-sdk'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {transactionInterface} from '@/interface/sdkTransaction'
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'


@Component({
    components: {
        CheckPWDialog
    }
})
export default class TransferTransactionTs extends Vue {
    node = ''
    remark = ''
    currentXem = ''
    mosaicList = []
    mosaic: any = ''
    amount: any = '0'
    fee: any = '50000'
    generationHash = ''
    accountAddress = ''
    accountPublicKey = ''
    transactionDetail = {}
    isShowSubAlias = false
    showCheckPWDialog = false
    address = 'SCSXIT-R36DCY-JRVSNE-NY5BUA-HXSL7I-E6ULEY-UYRC'

    get getWallet() {
        return this.$store.state.account.wallet
    }

    initForm() {
        this.fee = '50000'
        this.remark = ''
        this.address = ''
        this.mosaic = ''
        this.amount = '0'
    }

    checkInfo() {
        if (!this.checkForm()) {
            return
        }
        this.showDialog()
    }

    showDialog() {
        const {address, mosaic, amount, remark, fee} = this
        this.transactionDetail = {
            "transaction_type": 'ordinary_transfer',
            "transfer_target": address,
            "asset_type": mosaic,
            "quantity": amount,
            "fee": fee + 'gas',
            "remarks": remark
        }
        this.showCheckPWDialog = true
    }

    sendTransaction(key) {
        const that = this
        let {accountPublicKey, accountAddress, node, address, mosaic, amount, remark, fee, generationHash} = this
        const account = Account.createFromPrivateKey(key, this.getWallet.networkType)

        transactionInterface.transferTransaction({
            network: this.getWallet.networkType,
            MaxFee: fee,
            receive: address,
            MessageType: 0,
            mosaics: [new Mosaic(new MosaicId(mosaic), UInt64.fromUint(amount))],
            message: remark
        }).then((transactionResult) => {
            // sign tx
            const transaction = transactionResult.result.transferTransaction
            // const transaction = tx
            console.log(transaction)
            const signature = account.sign(transaction, generationHash)
            // send tx
            transactionInterface.announce({signature, node}).then((announceResult) => {
                // get announce status
                announceResult.result.announceStatus.subscribe((announceInfo: any) => {
                    console.log(signature)
                    that.$Notice.success({
                        title: this.$t(Message.SUCCESS) + ''
                    })
                    that.initForm()
                })
            })

        })
    }

    checkForm() {
        const {address, mosaic, amount, remark, fee} = this
        if (address.length < 40) {
            this.showErrorMessage(this.$t(Message.ADDRESS_FORMAT_ERROR))
            return false
        }
        if (mosaic == '' || mosaic.trim() == '') {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR))
            return false
        }
        if ((!Number(amount) && Number(amount) !== 0) || Number(amount) < 0) {
            this.showErrorMessage(this.$t(Message.AMOUNT_LESS_THAN_0_ERROR))
            return false
        }
        if ((!Number(fee) && Number(fee) !== 0) || Number(fee) < 0) {
            this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR))
            return false
        }
        return true
    }

    showErrorMessage(message) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    async getMosaicList() {
        const that = this
        let {accountPublicKey, currentXem, accountAddress, node, address, mosaic, amount, remark, fee} = this
        const {currentXEM1, currentXEM2} = this.$store.state.account
        let mosaicIdList = []
        await accountInterface.getAccountInfo({
            node,
            address: accountAddress
        }).then(async accountInfoResult => {
            await accountInfoResult.result.accountInfo.subscribe((accountInfo) => {
                let mosaicList = []
                // set mosaicList
                mosaicList = accountInfo.mosaics.map((item) => {
                    item._amount = item.amount.compact()
                    item.value = item.id.toHex()
                    if (item.value == currentXEM1 || item.value == currentXEM2) {
                        item.label = 'nem.xem' + ' (' + item._amount + ')'
                    } else {
                        item.label = item.id.toHex() + ' (' + item._amount + ')'
                    }
                    return item
                })
                let isCrrentXEMExists = mosaicList.every((item) => {
                    if (item.value == currentXEM1 || item.value == currentXEM2) {
                        return false
                    }
                    return true
                })
                if (isCrrentXEMExists) {
                    mosaicList.unshift({
                        value: currentXEM1,
                        label: 'nem.xem'
                    })
                }
                that.mosaicList = mosaicList
            }, () => {
                let mosaicList = []
                mosaicList.unshift({
                    value: currentXEM1,
                    label: 'nem.xem'
                })
                that.mosaicList = mosaicList
            })
        })
    }

    getNamespace(currentXem, mosaicIdList, currentXEM1, currentXEM2, mosaicList) {
        let currentXEMHex = ''
        const that = this
        mosaicInterface.getMosaicByNamespace({
            namespace: currentXem
        }).then((result: any) => {
            let isCrrentXEMExists = true
            let spliceIndex = -1
            isCrrentXEMExists = mosaicIdList.every((item, index) => {
                if (item.value == currentXEM1 || item.value == currentXEM2) {
                    spliceIndex = index
                    return false
                }
                return true
            })
            that.mosaicList = mosaicList
            that.mosaic = currentXEMHex
        })
    }

    initData() {
        this.accountPublicKey = this.getWallet.publicKey
        this.accountAddress = this.getWallet.address
        this.node = this.$store.state.account.node
        this.currentXem = this.$store.state.account.currentXem
        this.generationHash = this.$store.state.account.generationHash
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    checkEnd(key) {
        if (key) {
            this.sendTransaction(key)
        } else {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }


    @Watch('getWallet')
    onGetWalletChange() {
        this.initData()
        this.getMosaicList()
    }

    created() {
        // this.initForm()
        this.initData()
        this.getMosaicList()
    }

}