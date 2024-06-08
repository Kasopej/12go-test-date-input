import { } from '@nuxt/test-utils/runtime'
import { mount } from '@vue/test-utils'
import DateInput from '@/components/DateInput.vue'

describe('DateInput', () => {

    it('renders an input element', () => {
        const wrapper = mount(DateInput, {
            props: {
                modelValue: ''
            }
        })
        const input = wrapper.find('input')

        expect(input.exists()).toBe(true)
    })

    it('validates date passed during initialization (invalid)', async () => {
        const wrapper = mount(DateInput, {
            props: {
                modelValue: '2022-01-01'
            }
        })

        expect(wrapper.vm.dateIsInvalid).toBe(true)
    })

    it('validates date passed during initialization (valid)', async () => {
        const wrapper = mount(DateInput, {
            props: {
                modelValue: '01/01/2022'
            }
        })

        expect(wrapper.vm.dateIsInvalid).toBe(false)
    })

    it('validates date input changes (invalid)', async () => {
        const wrapper = mount(DateInput, {
            props: {
                modelValue: '01/01/2022'
            }
        })
        const input = wrapper.find('input')
        await input.setValue('2022-01-01')
        await input.trigger('input')
        await wrapper.setProps({ modelValue: wrapper.emitted('update:modelValue')?.[0][0] as string })

        expect(wrapper.vm.dateIsInvalid).toBe(true)
    })

    it('validates date input changes (valid)', async () => {
        const wrapper = mount(DateInput, {
            props: {
                modelValue: '2022-01-01'
            }
        })
        const input = wrapper.find('input')
        await input.setValue('01/01/2022')
        await input.trigger('input')
        await wrapper.setProps({ modelValue: wrapper.emitted('update:modelValue')?.[0][0] as string })

        expect(wrapper.vm.dateIsInvalid).toBe(false)
    })
})