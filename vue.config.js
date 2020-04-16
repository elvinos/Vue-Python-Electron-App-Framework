module.exports = {
    configureWebpack: {
        // Configuration applied to all builds
        target: 'web',
    },

    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                extraResources: ['dist/app']
            }
        }
    }
}
