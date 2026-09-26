<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Button, Form, FormItem, Input, NumberStepper, type FormInstance, type FormRules } from '@glass-ui/core'
import DemoBlock from '../components/DemoBlock.vue'

const formRef = ref<FormInstance>()
const formModel = reactive<{ nickname: string; email: string; count?: number }>({
  nickname: '',
  email: '',
  count: undefined,
})
const formRules: FormRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: ['blur', 'change'] },
    { max: 10, message: '昵称最长 10 个字符', trigger: ['blur', 'change'] },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] },
  ],
  count: [
    { required: true, message: '请选择创建数量', trigger: 'change' },
    { min: 1, max: 5, type: 'number', message: '数量须在 1~5 之间', trigger: 'change' },
  ],
}
const formResult = ref('')
async function onFormValidate() {
  const ok = await formRef.value!.validate()
  formResult.value = ok ? '校验通过 ✔' : '存在未通过字段 ✘'
}

const loginRef = ref<FormInstance>()
const loginModel = reactive<{ account: string; password: string }>({ account: '', password: '' })
const loginRules: FormRules = {
  account: [
    {
      required: true,
      trigger: 'blur',
      validator: (value) => (String(value).length >= 3 ? true : '账号至少 3 个字符'),
    },
  ],
  password: [{ required: true, message: '请输入密码', min: 6, trigger: 'blur' }],
}
</script>

<template>
  <div class="demo-page">
    <h1>Form 表单</h1>
    <p class="page-desc">
      Form + FormItem 组合，支持 model 级 / item 级规则、blur/change 触发校验、自定义 validator，
      以及 validate / resetFields / clearValidate 方法。
    </p>

    <DemoBlock title="基础校验" desc="失焦或变更时按 trigger 校验；点击校验执行整表 validate，重置还原初始值。">
      <Form
        ref="formRef"
        :model="formModel"
        :rules="formRules"
        label-width="86px"
        label-suffix=" :"
        scroll-to-error
        style="max-width: 420px"
      >
        <FormItem label="昵称" prop="nickname">
          <Input v-model="formModel.nickname" placeholder="1~10 个字符" />
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="formModel.email" type="email" placeholder="name@example.com" />
        </FormItem>
        <FormItem label="创建数量" prop="count">
          <NumberStepper v-model="formModel.count" :min="1" :max="9" />
        </FormItem>
        <div class="demo-row">
          <Button type="primary" @click="onFormValidate">校验</Button>
          <Button @click="formRef?.resetFields()">重置</Button>
          <Button @click="formRef?.clearValidate()">清除校验</Button>
          <span v-if="formResult" class="form-result">{{ formResult }}</span>
        </div>
      </Form>
    </DemoBlock>

    <DemoBlock title="顶置标签 + 自定义校验器" desc="label-position=top 布局；validator 返回字符串即为其作为错误消息。">
      <Form
        ref="loginRef"
        :model="loginModel"
        :rules="loginRules"
        label-position="top"
        style="max-width: 320px"
      >
        <FormItem label="账号" prop="account">
          <Input v-model="loginModel.account" placeholder="至少 3 个字符" />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="loginModel.password" type="password" placeholder="至少 6 位" />
        </FormItem>
        <div class="demo-row">
          <Button type="primary" @click="loginRef?.validate()">登录</Button>
          <Button @click="loginRef?.resetFields()">重置</Button>
        </div>
      </Form>
    </DemoBlock>
  </div>
</template>

<style scoped>
.form-result {
  font-size: 13px;
  color: var(--text-body);
}
</style>
