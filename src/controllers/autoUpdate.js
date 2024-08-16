const axios = require("axios");
const BlogModel = require("../models/blogModel");
const { getLinksBYTime } = require("../models/blogModel");
const BlogCSVModel = require("../models/CSVModels");
const BlogSimilarModel = require("../models/similarContentModels");
const BlogUniqueModel = require("../models/uniqueContentMoedels");
const AutoUpdateModel = require("../models/autoUpdate");
const { GetLinks } = require("./blogLinkController");
const autoUpdater = async () => {
    try {
const normalizeUrl = (await import('normalize-url')).default

        console.log("AutoUpdater function started");

        const getlast = await AutoUpdateModel.getLastUpdate();
        const dateInMilliseconds = new Date(getlast?.timestamp).getTime();
        const INmiliSec = ((60*24) * 60 * 1000)*7; // 7days  in milliseconds
        const theDiff = Date.now() - dateInMilliseconds;
        console.log("The diff in hour:", Math.round(theDiff / 1000 / 60/24));

        if (Date.now() - dateInMilliseconds >= INmiliSec) {
            const updatedLastUpdate = await AutoUpdateModel.updateLastUpdate(getlast._id, Date.now());
            console.log("Last update timestamp updated:", updatedLastUpdate);

            const checkToUpdate = await BlogModel.getLinksBYTime(); // Ensure you fetch the links to check for updates

            if (checkToUpdate && checkToUpdate.length > 0) {
              const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

              const result = await Promise.all(
                  checkToUpdate.map(async (each) => {
                      await delay(2000); // Delay for 2 seconds
              
                      const parsedUrl = new URL(each?.siteLink);
                      const domainPath = `${parsedUrl.hostname}${parsedUrl.pathname}`;
                      const response = await axios.get(`https://844d4297-5e03-4820-ad6f-a1cd84d3a1fc-00-fif3n7p64v3f.pike.replit.dev/extract_blog_links/${domainPath}`, {
                          withCredentials: true,
                      });
                      return {
                          fileName: response.data.respon.fileName,
                          siteURL: response.data.respon.site_link,
                      };
                  })
              );

                const insertPromises = result.map(async (linkData) => {
                    try {
                        console.log(linkData);
                        const existingFile = await BlogModel.findbysiteURL(normalizeUrl(linkData.siteURL));

                        // If file with same siteURL exists, delete and clean up related documents
                        if (existingFile) {
                            console.log("Existing file found, deleting:", existingFile);
                            await BlogModel.delete(normalizeUrl(linkData.siteURL)); // Assuming this deletes by user ID and siteURL
                            const csvFileId = await BlogCSVModel.deletebyRef(existingFile?._id);
                            await BlogUniqueModel.delete(csvFileId?._id); // Adjust according to your schema
                            await BlogSimilarModel.delete(csvFileId?._id); // Adjust according to your schema
                        }

                        // Add new link file
                        await BlogModel.AddNewFile(linkData.fileName, normalizeUrl(linkData.siteURL));

                    } catch (error) {
                        console.error("Error processing linkData:", error);
                    }
                });

                await Promise.all(insertPromises); // Wait for all insert operations to complete
               
              //  getting all filenames to delete from python
              
              
              let theLinkFilesARE = await BlogModel.getLinks()
              theLinkFilesARE = theLinkFilesARE.reduce((accum,curr)=>{
                return accum = [...accum,curr.fileName]
              },[])

              // get CSVnames
              let theCSVSNames = await BlogCSVModel.getCSVS()
              theCSVSNames = theCSVSNames.reduce((accum,curr)=>{
                return accum = [...accum,curr.fileName]
              },[])
              let unqiueFIleNames = await BlogUniqueModel.getUniqueByName()
              unqiueFIleNames = unqiueFIleNames.reduce((accur,crr)=>{
                let [basename,extension] = crr?.content?.split(".")
              return accur = [...accur,`${basename}.json`,`${basename}.csv`]
              },[])
              console.log({
                link:theLinkFilesARE,
                CSV:theCSVSNames,
                Unique:unqiueFIleNames
              })
              const fileDeleteresponse = await axios.post(`https://844d4297-5e03-4820-ad6f-a1cd84d3a1fc-00-fif3n7p64v3f.pike.replit.dev/delete_file/`,{
                link:theLinkFilesARE,
                CSV:theCSVSNames,
                Unique:unqiueFIleNames
              }, {
                            withCredentials: true,
                        });

                        console.log(fileDeleteresponse.data)
                return "Updated successfully";
            }
        }

        return "No updates needed at this time";
    } catch (error) {
        console.error("Error in autoUpdater:", error);
    }
};

module.exports = { autoUpdater };
