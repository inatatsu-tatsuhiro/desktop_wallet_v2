<template>
    <div class="transaction-list-outer-container">
        <div class="transaction-list-tabs-container">
            <TransactionListFilters @downloadTransactions="downloadTransactions" />
            <TransactionTable
                :transactions="getTransactions()"
                :empty-message="getEmptyMessage()"
                :load-more="loadMore"
                :pagination-type="paginationType"
                @click="onClickTransaction"
            />
        </div>

        <ModalTransactionDetails
            v-if="hasDetailModal"
            :visible="hasDetailModal"
            :transaction="activeTransaction"
            @close="onCloseDetailModal"
        />

        <ModalTransactionCosignature
            v-if="hasCosignatureModal"
            :visible="hasCosignatureModal"
            :transaction-hash="aggregateTransactionHash"
            @close="onCloseCosignatureModal"
            @blacklist="onBlackListContact"
            @transaction-signed-successfully="onTransactionSigned"
        />
        <ModalTransactionExport
            v-if="hasTransactionExportModal"
            :visible="hasTransactionExportModal"
            @close="hasTransactionExportModal = false"
        />

        <ModalAddNewContact
            v-if="transactionSignerAddress !== '' && !hasCosignatureModal && showAddContactModal"
            :visible="true"
            :signer-address="transactionSignerAddress"
            :transaction-hash="transactionHash"
            @close="onCloseContactModal"
        />
        <div v-if="showBlackListPopup" class="blacklist-box">
            <ModalAddedToBlacklistPopup :visible="true" />
        </div>
    </div>
</template>

<script lang="ts">
// @ts-ignore
import { TransactionListTs } from './TransactionListTs';
export default class TransactionList extends TransactionListTs {}
</script>
<style lang="less" scoped>
@import './TransactionList.less';
</style>
