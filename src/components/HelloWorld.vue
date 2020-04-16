<template>
  <div class="hello">
    <h1>{{ this.message }}</h1>
    <h3>Type some text and see if python receives it...</h3>
    <input type="text" v-model="inputValue" />
    <button @click="onClick">Send</button>
    <div>
      {{ response }}
    </div>
  </div>
</template>

<script>
  export const eel = window.eel;
  eel.set_host( 'ws://localhost:9000' );

    // Expose the `sayHelloJS` function to Python as `say_hello_js`
  function sayHelloJS(x) {
    console.log( 'Hello from ' + x )
  }
  // WARN: must use window.eel to keep parse-able eel.expose{...}
  window.eel.expose( sayHelloJS, 'say_hello_js' );

  // Test calling sayHelloJS, then call the corresponding Python function
  sayHelloJS( 'Javascript World!' );
  eel.say_hello_py( 'Javascript World!' );

  export default {
    name: 'HelloWorld',
    data: function () {
      return {
        message: "",
        inputValue: "",
        response: ""
      }
    },
    mounted: function () {
      eel.hello_world()((val) => {
        // Receiving a value from Python
        this.message = val
      })
    },
    methods: {
      onClick() {
        // Passing values to Python
        eel.print_string(this.inputValue)((val) => {
          // Return response from Python
          this.response = val
        })
      }
    }
  }
</script>

