import soap from 'soap';

export default class BlueriqManagement { 
    constructor (serviceDescriptionUri = "http://localhost:8093/Services/ManagementService?wsdl", user = "user", password="password") {
        this.serviceDescriptionUri = serviceDescriptionUri;
        this.serviceCredentials = { user: user, password: password };
    }


    async commit(repositoryName, branchName, commitMessage) {
        return await
            this.getClient()
                .then(client=> client.Commit({repository:repositoryName, branch:branchName, commitMessage:commitMessage}))
    }

    async createBranch(repositoryName, branchName, branchType, message) {
        return await
            this.getClient()
                .then(client=> client.CreateBranch({repository:repositoryName, branch:{Name:branchName, BranchType:branchType}, message:message }))
    }

    async createBranchType(repositoryName, branchTypeName) {
        return await
            this.getClient()
                .then(client=> client.CreateBranchType({repository:repositoryName, branchType:{Name:branchTypeName}}))
    }

    async createFeatureBranch(repositoryName, basedOnBranchName, newBranchName, newBranchType) {
        return await
            this.getClient()
                .then(client=> client.CreateFeatureBranch({repository:repositoryName,  basedOnBranch: basedOnBranchName, branch: { Name: newBranchName, BranchType: newBranchType }}))
    }   

    async createFeatureBranchOnRevision(repositoryName, basedOnBranchName, newBranchName, newBranchType) {
        return await
            this.getClient()
                .then(client=> client.CreateFeatureBranch({repository:repositoryName,  basedOnBranch: basedOnBranchName, branch: { Name: newBranchName, BranchType: newBranchType }}))
    }   

    async createRepository(repositoryName, functionalName, description) {
        return await
            this.getClient()
                .then(client=> client.CreateBranch({repository:{Name:repositoryName, FunctionalName:functionalName||'', Description: description||''}}))
    }

    async deleteBranch(repositoryName, branchName) {
        return await
            this.getClient()
                .then(client=> client.DeleteBranch({repository:repositoryName, branch:branchName}))
    }
    
    async deleteBranchType(repositoryName, branchTypeName) {
        return await
            this.getClient()
                .then(client=> client.DeleteBranchType({repository:repositoryName, branchType:branchTypeName}))
    }

    async deleteRepository(repositoryName) {
        return await
            this.getClient()
                .then(client=> client.DeleteRepository({repository:repositoryName}))
    }

    async executeAllUnitTests(repositoryName, branchName, projectName, moduleName, moduleType) {
        return await
            this.getClient()
                .then(client=> client.ExecuteAllUnitTests({repository:repositoryName, branch:branchName, project:projectName, module: { Name:moduleName, ModuleType: moduleType} }))
                .then(data=> data.ExecuteAllUnitTestsResult || [])
    }

    async executeUnitTests(repositoryName, branchName, projectName, moduleName, moduleType, unitTests) {
        return await
            this.getClient()
                .then(client=> client.ExecuteAllUnitTests({repository:repositoryName, branch:branchName, project:projectName, module: { Name:moduleName, ModuleType: moduleType}, unittests:{string:unitTests} }))
                .then(data=> data.ExecuteUnitTestsResult || [])
    }

    async exportBranch(repositoryName, branchName) {
        return await
            this.getClient()
                .then(client=> client.ExportBranch({repository:repositoryName, branch:branchName}))
                .then(data=> data.ExportBranchResult.Content || '')
    }

    async exportLibrary(repositoryName, branchName, libraryName) {
        return await
            this.getClient()
                .then(client=> client.ExportLibrary({repository:repositoryName, branch:branchName, library: libraryName}))
                .then(data=> data.ExportLibraryResult.Content || '')
    }

    async exportPackage(repositoryName, branchName, packageName) {
        return await
            this.getClient()
                .then(client=> client.ExportPackage({repository:repositoryName, branch:branchName, packageName:packageName}))
                .then(data=> data.ExportPackageResult.Content || '')
    }
    
    async exportProject(repositoryName, branchName, projectName, encrypt = true) {
        return await
            this.getClient()
                .then(client=> client.ExportProject({repository:repositoryName, branch:branchName, project:projectName, encrypt:encrypt}))
                .then(data=> data.ExportProjectResult.Content || '')
    }

    async exportProjectRevision(repositoryName, branchName, revisionId, projectName, encrypt = true) {
        return await
            this.getClient()
                .then(client=> client.ExportProjectRevision({repository:repositoryName, branch:branchName, revisionId:revisionId, project:projectName, encrypt:encrypt}))
                .then(data=> data.ExportProjectRevisionResult.Content || '')
    }

    async exportProjectRevisionWithMetadata(repositoryName, branchName, revisionId, projectName, encrypt = true) {
        return await
            this.getClient()
                .then(client=> client.ExportProjectRevisionWithMetadata({repository:repositoryName, branch:branchName, revisionId:revisionId, project:projectName, encrypt:encrypt}))
                .then(data=> data.ExportProjectRevisionWithMetadataResult)
    }

    async getClient() {
        return soap
                .createClientAsync(this.serviceDescriptionUri)
                .then(client=>{ client.setSecurity(new soap.BasicAuthSecurity(this.serviceCredentials.user, this.serviceCredentials.password)); return client; })
    }

    async getBranches(repositoryName, filterFunction) {
        return await
            this.getClient()
                .then(client=> client.GetBranchesAsync({repository: repositoryName}))
                .then(data => data.GetBranchesResult.string)
                .then(data => Array.from(data).filter(filterFunction || (x=>true)))
    }

    async getBranch(repositoryName, branchName) {
        return await
            this.getClient()
                .then(client=> client.GetBranchAsync({repository: repositoryName, branch: branchName }))
                .then(data => data.GetBranchResult)
    }

    async getBranchTypes(repositoryName, filterFunction) {
        return await
            this.getClient()
                .then(client=> client.GetBranchTypesAsync({repository: repositoryName}))
                .then(data => data.GetBranchTypesResult.string)
                .then(data => Array.from(data).filter(filterFunction || (x=>true)))
    }

    async getBranchType(repositoryName, branchType) {
        return await
            this.getClient()
                .then(client=> client.GetBranchAsync({repository: repositoryName, branchType: branchType }))
                .then(data => data.GetBranchTypeResult)
    }

    async getCurrentIdentity() { 
        return await
            this.getClient()
                .then(client=> client.GetCurrentIdentityAsync())
                .then(data => data.GetCurrentIdentityResult)
    }

    async getLicenseData() { 
            return await
                this.getClient()
                    .then(client=> client.GetLicenseDataAsync())
                    .then(data => data.GetLicenseDataResult)
    }   

    async getPackages(repositoryName, branchName, filterFunction) {
        return await 
            this.getClient()
                .then(client => client.GetPackagesAsync({repository: repositoryName, branch: branchName}))
                .then(data => data.GetPackagesResult.string)
                .then(data => Array.from(data).filter(filterFunction || (x=>true)))
    }
    
    async getPackage(repositoryName, branchName, packageName) {
        return await 
            this.getClient()
                .then(client => client.GetPackageAsync({repository: repositoryName, branch: branchName, packageName: packageName}))
                .then(data => data.GetPackageResult)
    }
    
    async getProjects(repositoryName, branchName, includeLibraries = false, filterFunction) {
        return await 
            this.getClient()
                .then(client => client.GetProjectsAsync({repository: repositoryName, branch: branchName, includeLibraries: includeLibraries}))
                .then(data => data.GetProjectsResult.string)
                .then(data => Array.from(data).filter(filterFunction || (x=>true)))
    }

    async getProjectsForRevision(repositoryName, branchName, revisionId, includeLibraries = false, filterFunction) {
        return await 
            this.getClient()
                .then(client => client.GetProjectsForRevisionAsync({repository: repositoryName, branch: branchName, revisionId: revisionId, includeLibraries: includeLibraries}))
                .then(data => data.GetProjectsForRevisionResult.string)
                .then(data => Array.from(data).filter(filterFunction || (x=>true)))
    }

    async getProject(repositoryName, branchName, projectName) {
        return await
            this.getClient()
                .then(client=> client.GetProjectAsync({repository: repositoryName, branch: branchName, project: projectName}))
                .then(data => data.GetProjectResult)
    }

    async getRepositories(filterFunction) {
        return await 
            this.getClient()
                .then(client => client.GetRepositoriesAsync())
                .then(data => data.GetRepositoriesResult.string)
                .then(data => Array.from(data).filter(filterFunction || (x=>true)))
    }

    async getRepository(repositoryName) {
        return await
            this.getClient()
                .then(client=> client.GetRepositoryAsync({repository: repositoryName}))
                .then(data => data.GetRepositoryResult)
    }

    async getRevisions(repositoryName, branchName, startIndex = 0, amount = 1, taggedOnly = false, includeMergeRevisions = false, filterFunction) {
        return await 
        this.getClient()
            .then(client => client.GetRevisionsAsync({repository: repositoryName, branch: branchName, startIndex: startIndex, amount:amount, taggedOnly:taggedOnly, includeMergeRevisions:includeMergeRevisions }))
            .then(data => data.GetRevisionsResult.Revision)
            .then(data => Array.from(data).filter(filterFunction || (x=>true)))
    }

    async getRevision(repositoryName, revisionId) {
        return await
            this.getClient()
                .then(client=> client.GetRevisionAsync({repository: repositoryName, revisionId: revisionId}))
                .then(data => data.GetRevisionResult)
    }

    async getRevisionChanges(repositoryName, branchName, revisionId, filterFunction) {
        return await
            this.getClient()
                .then(client=> client.GetRevisionChangesAsync({repository: repositoryName, branch: branchName, revision: revisionId}))
                .then(data => data.GetRevisionChangesResult.ElementChange)
                .then(data => Array.from(data).filter(filterFunction || (x=>true)))
    }

    async getRevisionDescriptor(repositoryName, revisionId) {
        return await
            this.getClient()
                .then(client=> client.GetRevisionDescriptorAsync({repository: repositoryName, revisionId: revisionId}))
                .then(data => data.GetRevisionDescriptorResult)
    }

    async getStatus(repositoryName, branchName) {
        return await
            this.getClient()
                .then(client=> client.GetStatusAsync({repository: repositoryName, branch: branchName }))
                .then(data => data.GetStatusResult)
    }

    async importBranch(repositoryName, branchName, importData, deleteUnknownElements = true) {
        return await
            this.getClient()
                .then(client=> client.ImportBranchAsync({repository: repositoryName, branch: branchName, data: importData, deleteUnknownElements: deleteUnknownElements}))
    }

    async importLibrary(repositoryName, branchName, importArguments = null, importData, deleteUnknownElements = true) {
        return await
            this.getClient()
                .then(client=> client.ImportLibraryAsync({repository: repositoryName, branch: branchName, arguments:{Arguments:importArguments}, base64String: importData}))
    }

    async importSpecification(repositoryName, branchName, projectName, moduleName, importData) {
        return await
            this.getClient()
                .then(client=> client.ImportLibraryAsync({repository: repositoryName, branch: branchName, project: projectName, module:moduleName, base64SpecificationString: importData}))
    } 

    async isInRole(userRole) {
        return await
            this.getClient()
                .then(client=> client.IsInRoleAsync({userRole: userRole }))
                .then(data => data.IsInRoleResult)
    }

    async logOut(sessionId) {
        return await
            this.getClient()
                .then(client=> client.LogoutAsync({sessionId: sessionId}))
    } 

    async mergeBranch(repositoryName, targetBranchName, sourceBranchName, discard, preview) {
        return await
            this.getClient()
                .then(client=> client.MergeBranchAsync({repository:repositoryName, targetBranch:targetBranchName, sourceBranch:sourceBranchName, discard:discard, preview:preview}))
                .then(data=> data.MergeBranchResult)
    }
    
    async mergeRevision(repositoryName, targetBranchName, sourceBranchName, revisionId, discard, preview) {
        return await
            this.getClient()
                .then(client=> client.MergeRevisionAsync({repository:repositoryName, targetBranch:targetBranchName, sourceBranch:sourceBranchName, revisionId: revisionId, discard:discard, preview:preview}))
                .then(data=> data.MergeRevisionResult)
    }

    async setTags(repositoryName, revisionId, tags) {
        return await
            this.getClient()
                .then(client=> client.SetTagsAsync({repository:repositoryName, revisionId:revisionId, tags: { string: tags }}))
    }

    async validateProject(repositoryName, branchName, projectName) {
        return await
            this.getClient()
                .then(client=> client.ValidateProjectAsync({repository:repositoryName, branch:branchName, project:projectName}))
                .then(data=> data.ValidateProjectResult)
    }

}
