<template>
    <div class="homepage">
        <heading title="{{ head.title }}" />  
    </div>
</template>

<script>
import headModel from '../components/atoms/text/mock/heading'

export default {
    name: 'Heading',

    data () {
        return {
            head: headModel.models.default
        }
    }
}
</script>

<style lang="scss" scoped>

</style>