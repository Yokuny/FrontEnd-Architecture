import { GET, PATCH, request } from '../api/fetch.config';

interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

// TODO: CONST
const typeMap: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

export const getPresignedUrl = async (recordId: string, contentType: string): Promise<PresignedUrlResponse> => {
  if (!typeMap[contentType.toLowerCase()]) {
    throw new Error(`Tipo de arquivo não suportado: ${contentType}`);
  }

  const params = new URLSearchParams({
    originalID: recordId,
    contentType: contentType,
  });
  const res = await request(`s3/presigned-url?${params}`, GET());

  if (!res.success) throw new Error(res.message || 'Erro ao obter URL de upload');
  return res.data;
};

export const uploadToS3 = async (uploadUrl: string, file: File) => {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (res.ok) return res.url;
};

export const updateRecordImage = async (recordId: string, recordType: 'odontogram' | 'financial', imageUrl: string) => {
  const res = await request(`${recordType}/${recordId}/image-url`, PATCH({ image: imageUrl }));
  if (!res.success) throw new Error(res.message || 'Erro ao atualizar registro');
};
export const removeRecordImage = async (recordId: string, recordType: 'odontogram' | 'financial'): Promise<void> => {
  const res = await request(`${recordType}/${recordId}/image-url`, PATCH({ image: '' }));
  if (!res.success) throw new Error(res.message || 'Erro ao remover imagem');
};
