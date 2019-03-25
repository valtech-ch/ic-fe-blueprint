module.exports = {
    components: [
        {
            view: "atom/text/heading",
            model: "default"
        },
        {
            view: "atom/layout/double",
            model: "default",
            placeholders: [
                {
                    name: "phLeft",
                    components: [
                        {
                            view: "atom/text/heading",
                            model: "default"
                        }
                    ]
                },
                {
                    name: "phRight",
                    components: [
                        {
                            view: "atom/text/heading",
                            model: "baum"
                        },
                        {
                            view: "atom/text/heading",
                            model: "baum"
                        }
                    ]
                }
            ]  
        }
    ],
  }
  