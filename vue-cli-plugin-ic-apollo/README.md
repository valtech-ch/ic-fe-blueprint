# Vue CLI Plugin Infocentric Apollo

## Goal

The goal of this plugin is to extend ic-fe-blueprint with the needed plugins and configurations to enable apollo queries to run in blueprint.

## Requirements

You need @vue/cli to be installed on your machine

## Setup

Add vue cli to your project:
```
npm add @vue/cli
```

To enable this add the following script to your project package.json:
```
"postinstall": "npm explore ic-fe-blueprint -- vue add ic-apollo"
```

The plugin (including its generator) takes care that it can be installed/executed several times without harm.

## Drawbacks

The current apollo configuration may match your needs but is not yet configurable by the project.
Please creat an issue on https://github.com/infocentric/ic-fe-blueprint/issues if you are in need of customising it for your project.
