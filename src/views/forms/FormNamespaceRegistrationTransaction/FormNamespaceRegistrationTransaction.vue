<template>
  <FormWrapper>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        onsubmit="event.preventDefault()"
        @keyup.enter="handleSubmit(onSubmit)"
        class="form-container mt-3"
      >
        <SignerSelector v-model="formItems.signerPublicKey" />

        <div class="form-row">
          <ValidationProvider
            tag="div" mode="lazy" vid="registrationType"
            :name="$t('registrationType')"
            :rules="'required'"
            v-slot="{ errors }"
          >
            <FormLabel>{{ $t('form_label_registration_type') }}</FormLabel>
            <select v-model="formItems.registrationType"
                    class="input-size input-style">
              <option :value="typeRootNamespace">{{ $t('option_root_namespace') }}</option>
              <option v-if="ownedNamespaces.length"
                      :value="typeSubNamespace">{{ $t('option_sub_namespace') }}</option>
            </select>
          </ValidationProvider>
        </div>

        <NamespaceSelector
          v-if="formItems.registrationType === typeSubNamespace && ownedNamespaces.length"
          v-model="formItems.parentNamespaceName"
          :namespace-registration-type="formItems.registrationType"
        />

        <NamespaceNameInput
          v-model="formItems.newNamespaceName"
          :namespace-registration-type="formItems.registrationType"
        />

        <DurationInput
          v-if="formItems.registrationType === typeRootNamespace"
          v-model="formItems.duration"
          target-asset="namespace"
        />

        <!-- Transaction fee selector -->
        <MaxFeeSelector v-model="formItems.maxFee" />

        <div class="form-line-container fixed-full-width-item-container mt-3">
          <button
            type="submit"
            class="centered-button button-style validation-button"
            @click="handleSubmit(onSubmit)"
          >
            {{ $t('send') }}
          </button>
        </div>
      </form>
    </ValidationObserver>

    <ModalTransactionConfirmation
      v-if="hasConfirmationModal"
      :visible="hasConfirmationModal"
      @success="onConfirmationSuccess"
      @error="onConfirmationError"
    />
  </FormWrapper>
</template>

<script lang="ts">
// @ts-ignore
import {FormNamespaceRegistrationTransactionTs} from './FormNamespaceRegistrationTransactionTs'
export default class FormNamespaceRegistrationTransaction extends FormNamespaceRegistrationTransactionTs {}
</script>