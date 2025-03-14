import { auth } from '@/actions/auth';
import { googleDrive } from './api';
import { driveFileToDriveFile, FileType } from './types';
import prisma from '@/db';
import { log } from '@/lib/utils';

async function getMissionFolderIdFromDrive(code: string): Promise<string | undefined> {
    try {
        const session = await auth();
        const drive = googleDrive(session);
        const folderList = await drive.files.list({
            q: `'${process.env.DOSSIER_SUIVI}' in parents`,
        });
        const mission_folders = folderList.data.files?.map(driveFileToDriveFile) || [];
        const missionFolderId = mission_folders.find(
            (file) => file.name == code && file.mimeType == FileType.Folder
        )?.id;
        if (missionFolderId) {
            return missionFolderId;
        }
        log(`Creating folder for study ${code}`);
        const fileMetadata = {
            name: code,
            mimeType: FileType.Folder,
            parents: [process.env.DOSSIER_SUIVI],
        };
        const creationResponse = await drive.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });
        return creationResponse.data.id || undefined;
    } catch (e) {
        console.error(`[getMissionFolder] ${e}`);
    }
}

export async function getMissionFolderId(code: string): Promise<string | undefined> {
    try {
        const study = await prisma.studyInfos.findUnique({
            where: { code },
        });
        const folderId = study?.googleFolder;
        if (folderId) {
            return folderId;
        }
        const googleFolder = await getMissionFolderIdFromDrive(code);
        await prisma.studyInfos.update({ where: { code }, data: { googleFolder } });
        return googleFolder;
    } catch (e) {
        console.error(`[getMissionFiles] ${e}`);
    }
}
