# The `image-store` folder

Contains images of releases including the logo and screenshots.

The structure is as follows:

- Release folder: `./{fem-id}/{release-id}`
- Logo (optional): `{release-folder}/logo.png`
- Screenshot folder: `{release-folder}/screenshots/`
- Screenshots (optional): `{screenshot-folder}/*.[png|jpg|svg]` 

Additionally, there is the `./femId/releaseId` folder, which contains a placeholder `logo.png` file for releases 
without a logo (this ensures consistency in the URLs of these images, even if it doesn't exist).

### Accessibility via HTTPS
The `image-store` folder gets served via HTTP as `/images/`.
