<template>
    <div>
        <div class="overflow_ellipsis">
            <AddressDisplay v-if="transaction.type !== transactionType.TRANSFER" :address="transaction.signer.address" />
            <AddressDisplay
                v-if="transaction.type === transactionType.TRANSFER"
                :address="
                    address.plain() === transaction.signer.address.plain() ? transaction.recipientAddress : transaction.signer.address
                "
            />
        </div>
        <div class="bottom overflow_ellipsis">
            <span>{{ transactionDescription }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { ActionDisplayTs } from './ActionDisplayTs';
export default class ActionDisplay extends ActionDisplayTs {}
</script>
