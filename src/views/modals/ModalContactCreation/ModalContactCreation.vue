<template>
    <div class="container">
        <Modal v-model="show" class-name="modal-container" :title="$t('add_contact')" :transfer="false">
            <FormContactCreation @submit="onSubmit" />
            <div slot="footer" class="modal-footer"></div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalContactCreationTs } from './ModalContactCreationTs';
export default class ModalContactCreation extends ModalContactCreationTs {}
</script>

<style lang="less" scoped>
.float-right {
    float: right;
}
</style>
