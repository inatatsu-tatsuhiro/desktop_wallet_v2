<template>
    <FormRow>
        <template v-slot:label>
            <span v-show="isFirstItem">{{ $t('mosaic') }}:</span>
        </template>
        <template v-slot:inputs>
            <div class="row-mosaic-attachment-input inputs-container">
                <MosaicSelector v-model="chosenValue.mosaicHex" :mosaic-hex-ids="mosaicHexIds" @input="onChangeMosaic" />
                <AmountInput
                    :key="chosenValue.mosaicHex"
                    v-model="relativeAmount"
                    :mosaic-hex="chosenValue.mosaicHex"
                    class="ml-2"
                    :is-offline="isOffline"
                    :selected-fee-value="selectedFeeValue"
                    :is-aggregate="isAggregate"
                    @input="onChangeAmount"
                />
                <div v-show="isShowDelete" class="delete-mosaic-container">
                    <span class="delete-mosaic-icon" @click="$emit('input-deleted', uid)" />
                </div>
            </div>
        </template>
    </FormRow>
</template>

<script lang="ts">
import { MosaicAttachmentInputTs } from './MosaicAttachmentInputTs';
export default class MosaicAttachmentInput extends MosaicAttachmentInputTs {}
</script>
