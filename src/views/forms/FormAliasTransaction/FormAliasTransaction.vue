<template>
    <FormWrapper>
        <ValidationObserver ref="observer" v-slot="{ handleSubmit }" slim>
            <form onsubmit="event.preventDefault()" class="form-container">
                <SignerSelector v-model="formItems.signerAddress" :root-signer="currentAccountSigner" @input="onChangeSigner" />

                <!-- UNLINK alias action -->
                <FormRow v-if="aliasAction === AliasAction.Unlink">
                    <template v-slot:inputs>
                        <div class="row-left-message">
                            <span>
                                {{
                                    $t('unlink_namespace_from', {
                                        aliasTarget: formItems.aliasTarget,
                                        namespaceName: namespaceId.fullName,
                                    })
                                }}
                            </span>
                        </div>
                    </template>
                </FormRow>

                <!-- LINK alias action -->
                <div v-else>
                    <FormRow>
                        <template v-slot:label> {{ $t('form_label_alias_type') }}: </template>
                        <template v-slot:inputs>
                            <ValidationProvider
                                :name="$t('registrationType')"
                                :rules="'required'"
                                mode="lazy"
                                vid="registrationType"
                                tag="div"
                                class="select-container"
                            >
                                <div class="position-relative">
                                    <Select
                                        v-model="aliasTargetType"
                                        class="select-size select-style"
                                        @on-change="formItems.aliasTarget = ''"
                                    >
                                        <Option value="mosaic">
                                            {{ $t('option_link_mosaic') }}
                                        </Option>
                                        <Option v-show="assetType === 'namespace'" value="address">
                                            {{ $t('option_link_address') }}
                                        </Option>
                                    </Select>
                                </div>
                            </ValidationProvider>
                        </template>
                    </FormRow>

                    <div v-if="aliasAction === AliasAction.Link">
                        <NamespaceSelector
                            v-model="formItems.namespaceFullName"
                            label="form_label_choose_namespace"
                            :namespaces="linkableNamespaces"
                            :disable-linked="true"
                        />

                        <FormRow v-if="aliasTargetType === 'mosaic'">
                            <template v-slot:label> {{ $t('mosaic') }}: </template>
                            <template v-slot:inputs>
                                <MosaicSelector
                                    v-model="formItems.aliasTarget"
                                    :mosaic-hex-ids="linkableMosaics"
                                    default-mosaic="firstInList"
                                    label="form_label_link_mosaic"
                                />
                            </template>
                        </FormRow>

                        <!-- Transfer recipient input field -->
                        <AddressInput
                            v-if="aliasTargetType === 'address'"
                            v-model="formItems.aliasTarget"
                            label="form_label_link_address"
                        />
                    </div>
                </div>

                <MaxFeeAndSubmit
                    v-model="formItems.maxFee"
                    :hide-submit="hideSubmit"
                    @button-clicked="hideSubmit ? '' : handleSubmit(onSubmit)"
                />
            </form>
        </ValidationObserver>
        <ModalTransactionConfirmation
            v-if="hasConfirmationModal"
            :command="command"
            :visible="hasConfirmationModal"
            @success="onConfirmationSuccess"
            @error="onConfirmationError"
            @close="onConfirmationCancel"
        />
    </FormWrapper>
</template>

<script lang="ts">
import { FormAliasTransactionTs } from './FormAliasTransactionTs';
export default class FormAliasTransaction extends FormAliasTransactionTs {}
</script>

<style lang="less" scoped>
.account-unlock-container {
    display: block;
    width: 100%;
    clear: both;
    min-height: 1rem;
}
.row-left-message {
    padding-left: 0.1rem;
}
</style>
