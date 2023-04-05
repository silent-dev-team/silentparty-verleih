# Extension-Dev

## QuickStart

### New Extension

To create a new extension:
```npm init directus-extension```

### dev extension

1. go into the project directory
2. start the directus docker-compose with "./extension/dist" as extension-volume
3. run ```npm run dev``` in the extension directory
4. have fun
   
### Deploy the new extension

Copy the make-file from an existing extension to the new extension directory.

Now it will me automagically build, if the extension-volume is "extensions:/directus/extensions" in the docker-compose