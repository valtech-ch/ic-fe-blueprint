<template>
  <div>
    <h1>Next features</h1>
    <h3> Dynamic import modules </h3>
    <pre>
      {{ numbers }}
    </pre>
    <h3> Nullish Coalescing </h3>
    <code>
      <strong>example: undefined ?? 'some truthy value'</strong>
    </code>
    <p>
      <code> {{ nullish }} </code>
    </p>
    <h3> Optional Chaining </h3>
    <code>
      {{ optional }}
    </code>
    <h4>Non existing prop</h4>
    <code>
      <strong>example: optionalChainingObject.prop1?.nonExistingPropInObject</strong>
    </code>
    <p>
      <code>
        {{ nonExistingProp }}
      </code>
    </p>
    <h4> Global this </h4>
    <code>
      <strong>example code executed: globalThis.setTimeout === window.setTimeout</strong>
      <code>
        {{ globalThisComputed }}
      </code>
    </code>
  </div>
</template>

<script>
export default {
  name: 'Next',
  data () {
    return {
      numbers: {},
      nullish: undefined ?? 'some truthy value',
      optionalChainingObject: {
        prop1: {
          prop2: 100
        }
      }
    }
  },
  computed: {
    optional () {
      return this.optionalChainingObject.prop1?.prop2
    },
    nonExistingProp () {
      return this.optionalChainingObject.prop1?.nonExistingPropInObject
    },
    globalThisComputed () {
      // eslint-disable-next-line no-undef
      return globalThis.setTimeout === window.setTimeout
    }
  },
  methods: {
    promiseArray () {
      const promiseArray = [
        Promise.resolve(100),
        Promise.reject(new Error('Error happened'))
      ]
      Promise.allSettled(promiseArray).then(results => {
        console.log('All promise settled', results)
      })
    }
  },
  mounted () {
    import('./someModule').then((module) => {
      this.numbers = module.addNumbers([1, 2, 3, 4])
    })
    this.promiseArray()
  }
}
</script>
