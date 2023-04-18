const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const db = require("../models");
const ImageConfiguration = db.ImageConfiguration;
const Image = db.Image;

module.exports = class ImageService {

    uploadImage = async images => {

        let result = [];

        for (let key in images) {

            for(let image of images[key]) {

                try{

                    if(image.originalname.includes(' ')){
                        image.filename = image.originalname.replace(' ', '-');
                    }
                    
                    let oldPath = path.join(__dirname, `../storage/tmp/${image.originalname}`);

                    let filename = await fs.access(path.join(__dirname, `../storage/images/gallery/original/${path.parse(image.filename).name}.webp`)).then(async () => {
                        // Dar al usuario la opción de sobreescribir la imagen
                        return `${path.parse(image.filename).name}-${new Date().getTime()}.webp`;
                    }).catch(async () => {
                        return `${path.parse(image.filename).name}.webp`;
                    });
                        
                    await sharp(oldPath)
                    .webp({ lossless: true })
                    .toFile(path.join(__dirname, `../storage/images/gallery/original/${filename}`));

                    await sharp(oldPath)
                    .resize(135,135)
                    .webp({ lossless: true })
                    .toFile(path.join(__dirname, `../storage/images/gallery/thumbnail/${filename}`));

                    await fs.unlink(oldPath);

                    result.push(filename);

                } catch (error) {
                    console.log(error);
                }    
            }
        }

        return result;
    }

    resizeImages = async (entity, entityId, images) => {

        try{

            for (let image in images) {

                const imageConfigurations =  await ImageConfiguration.findAll({
                    where: {
                        entity: entity,
                        name: images[image].name
                    }
                });

                for (let imageConfiguration of imageConfigurations) {

                    for (let file of images[image].files) {
    
                        let imageResize = {};
    
                        await fs.access(path.join(__dirname, `../storage/images/resized/${path.parse(file.filename).name}-${imageConfiguration.widthPx}x${imageConfiguration.heightPx}.webp`)).then(async () => {
    
                            let start = new Date().getTime();
    
                            let stats = await fs.stat(path.join(__dirname, `../storage/images/resized/${path.parse(file.filename).name}-${imageConfiguration.widthPx}x${imageConfiguration.heightPx}.webp`));
                            imageResize = await sharp(path.join(__dirname, `../storage/images/resized/${path.parse(file.filename).name}-${imageConfiguration.widthPx}x${imageConfiguration.heightPx}.webp`)).metadata();
                            imageResize.size = stats.size;
    
                            let end = new Date().getTime();
    
                            imageResize.latency = end - start;                        
    
                        }).catch(async () => {
    
                            let start = new Date().getTime();
                            
                            imageResize = await sharp(path.join(__dirname, `../storage/images/gallery/original/${file.filename}`))
                            .resize(imageConfiguration.widthPx, imageConfiguration.heightPx)
                            .webp({ nearLossless: true })
                            .toFile(path.join(__dirname, `../storage/images/resized/${path.parse(file.filename).name}-${imageConfiguration.widthPx}x${imageConfiguration.heightPx}.webp`));
                            
                            let end = new Date().getTime();
    
                            imageResize.latency = end - start;                        
                        });
    
                        await Image.create({
                            imageConfigurationId: imageConfiguration.id,
                            entityId: entityId,
                            entity: entity,
                            name: images[image].name,
                            originalFilename: file.filename,
                            resizedFilename: `${path.parse(file.filename).name}-${imageConfiguration.widthPx}x${imageConfiguration.heightPx}.webp`,
                            title: file.title,
                            alt: file.alt,
                            languageAlias: file.languageAlias,
                            mediaQuery: imageConfiguration.mediaQuery,
                            sizeBytes: imageResize.size,
                            latencyMs: imageResize.latency,
                        });     
                    }
                }
            }

            return true;

        }catch(error){

            console.log(error);

            return false;
        }
    }

    deleteImages = async filename => {

        try{
            await fs.unlink(path.join(__dirname, `../storage/images/gallery/original/${filename}`));
            await fs.unlink(path.join(__dirname, `../storage/images/gallery/thumbnail/${filename}`));

            // Falta borrar las imágenes redimensionadas
            
            return 1;

        }catch{
            return 0;
        }
    }

    getThumbnails = async (limit, offset) => {

        let images = {};
        let files = await fs.readdir(path.join(__dirname, `../storage/images/gallery/thumbnail`));
        files = files.filter(file => file !== ".gitignore");

        images.filenames = await fs.readdir(path.join(__dirname, `../storage/images/gallery/thumbnail`), { limit: limit, offset: offset});
        images.filenames = images.filenames.filter(file => file !== ".gitignore");
        images.count = files.length;
    
        return images;
    }

    getImages = async (entity, entityId) => {

        const images = await images[image].findAll({
            where: {
                entity: entity,
                entityId: entityId
            }
        });

        return images;
    }
}