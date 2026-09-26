## Form API

### Form Attributes

| Name | Description | Type | Default |
|---|---|---|---|
| model | Data of form component. | `object` | — |
| rules | Validation rules of form. | `object` | — |
| inline | Whether the form is inline. | `boolean` | false |
| label-position | Position of label. If set to`'left'` or`'right'` ,`label-width` prop is also required. | `enum` | right |
| label-width | Width of label, e.g.`'50px'` . All its direct child form items will inherit this value.`auto` is supported. | `string` /`number` | '' |
| label-suffix | Suffix of the label. | `string` | '' |
| hide-required-asterisk | Whether to hide required fields should have a red asterisk (star) beside their labels. | `boolean` | false |
| require-asterisk-position | Position of asterisk. | `enum` | left |
| show-message | Whether to show the error message. | `boolean` | true |
| inline-message | Whether to display the error message inline with the form item. | `boolean` | false |
| status-icon | Whether to display an icon indicating the validation result. | `boolean` | false |
| validate-on-rule-change | Whether to trigger validation when the`rules` prop is changed. | `boolean` | true |
| size | Control the size of components in this form. | `enum` | — |
| disabled | Whether to disable all components in this form. Before 2.12.0 , if set to`true` , it will override the`disabled` prop of the inner component. After2.12.0 , the configuration of the internal components takes precedence. | `boolean` | false |
| scroll-to-error | When validation fails, scroll to the first error form entry. | `boolean` | false |
| scroll-into-view-options 2.3.2 | When validation fails, it scrolls to the first error item based on the scrollIntoView option. scrollIntoView . | `object` /`boolean` | true |

### Form Events

| Name | Description | Type |
|---|---|---|
| validate | triggers after a form item is validated | `Function` |

### Form Slots

| Name | Description | Subtags |
|---|---|---|
| default | customize default content | FormItem |

### Form Exposes

| Name | Description | Type |
|---|---|---|
| validate | Validate the whole form. Receives a callback or returns`Promise` . | `Function` |
| validateField | Validate specified fields. | `Function` |
| resetFields | Reset specified fields and remove validation result. | `Function` |
| scrollToField | Scroll to the specified fields. | `Function` |
| clearValidate | Clear validation messages for all or specified fields. | `Function` |
| fields 2.7.3 | Get all fields context. | `array` |
| getField 2.10.2 | Get a field context. | `Function` |
| setInitialValues 2.13.1 | Set initial values for form fields. When`resetFields` is called, fields will reset to these values. | `Function` |

## FormItem API

### FormItem Attributes

| Name | Description | Type | Default |
|---|---|---|---|
| prop | A key of`model` . It could be a path of the property (e.g`a.b.0` or`['a', 'b', '0']` ). In the use of`validate` and`resetFields` method, the attribute is required. | `string` /`string[]` | — |
| label | Label text. | `string` | — |
| label-position 2.7.7 | Position of item label. If set to`'left'` or`'right'` ,`label-width` prop is also required. Default extend`label-position` of`form` . | `enum` | '' |
| label-width | Width of label, e.g.`'50px'` .`'auto'` is supported. | `string` /`number` | — |
| required | Whether the field is required or not, will be determined by validation rules if omitted. | `boolean` | — |
| rules | Validation rules of form, see the following table , more advanced usage at async-validator . | `object` | — |
| error | Field error message, set its value and the field will validate error and show this message immediately. | `string` | — |
| show-message | Whether to show the error message. | `boolean` | true |
| inline-message | Inline style validate message. | `boolean` | false |
| size | Control the size of components in this form-item. | `enum` | — |
| for | Same as for in native label. | `string` | — |
| validate-status | Validation state of formItem. | `enum` | — |

#### FormItemRule

| Name | Description | Type | Default |
|---|---|---|---|
| trigger | How the validator is triggered. | `enum` | — |

TIP

If you don't want to trigger the validator based on input events, set the `validate-event` attribute as `false` on the corresponding input type components ( `<el-input>` , `<el-radio>` , `<el-select>` , ...).

### FormItem Slots

| Name | Description | Type |
|---|---|---|
| default | Content of Form Item. | — |
| label | Custom content to display on label. | `object` |
| error | Custom content to display validation message. | `object` |

### FormItem Exposes

| Name | Description | Type |
|---|---|---|
| size | Form item size. | `object` |
| validateMessage | Validation message. | `object` |
| validateState | Validation state. | `object` |
| validate | Validate form item. | `Function` |
| resetField | Reset current field and remove validation result. | `Function` |
| clearValidate | Remove validation status of the field. | `Function` |
| setInitialValue 2.13.1 | Set initial value for this field. When`resetField` is called, the field will reset to this value. | `Function` |

## Type Declarations

Show declarations

## Source

Component• Style• Docs

## Contributors