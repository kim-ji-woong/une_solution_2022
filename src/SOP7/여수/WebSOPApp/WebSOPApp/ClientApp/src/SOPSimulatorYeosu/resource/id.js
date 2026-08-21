import ProjectResource from "../../Root/resource/id";


export default class SopSimulatorYeosuResource {
    static get ID() {
        return SopSimulatorYeosuResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            projectName: "SOP여수",
        }
    }
}