import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const OLD_REPO_DOC_PATH = '/Users/tai/Projects/web/afore-web/public/documentazione';

type DocumentFile = {
  fileName: string;
  filePath: string;
  category: string | null;
  productType: string;
  lang: string;
};

/**
 * 根据文件名分类文档
 */
function categorizeDocument(fileName: string): string | null {
  const name = fileName.toLowerCase();
  
  if (name.includes('cei-021') || name.includes('cei-0-21') || name.includes('cei_021')) {
    return 'CEI 0-21';
  }
  if (name.includes('testreport') || name.includes('test report')) {
    return 'TEST REPORT';
  }
  if (name.includes('guida-regolamento') || name.includes('regolamento di esercizio') || name.includes('regolamento-esercizio')) {
    return 'Guida alla compilazione del regolamento di esercizio';
  }
  if (name.includes('guida-addendum') || name.includes('addendum tecnico') || name.includes('addendum-tecnico')) {
    return 'Guida alla compilazione dell\'addendum tecnico';
  }
  if (name.includes('verificationofconformity') || name.includes('verification of conformity')) {
    return 'TEST VERIFICATION OF CONFORMITY';
  }
  return null;
}

/**
 * 从文件名提取语言
 */
function extractLang(fileName: string): string {
  if (fileName.startsWith('IT_')) return 'IT';
  if (fileName.startsWith('EN_')) return 'EN';
  if (fileName.startsWith('ES_')) return 'ES';
  if (fileName.startsWith('FR_')) return 'FR';
  if (fileName.startsWith('DE_')) return 'DE';
  return 'IT'; // 默认
}

/**
 * 扫描文档目录
 */
async function scanDocumentazioneDirectory(): Promise<DocumentFile[]> {
  const documents: DocumentFile[] = [];
  
  try {
    // 扫描各个产品类型目录
    const productTypes = ['PV_INVERTER', 'ALL_IN_ONE', 'BATTERIA_DI_ACCUMULO', 'EV_CHARGER'];
    
    for (const productType of productTypes) {
      const dirPath = join(OLD_REPO_DOC_PATH, productType);
      
      try {
        const files = await readdir(dirPath);
        
        for (const file of files) {
          if (!file.toLowerCase().endsWith('.pdf')) continue;
          
          const filePath = join(dirPath, file);
          const stats = await stat(filePath);
          
          if (stats.isFile()) {
            const category = categorizeDocument(file);
            const lang = extractLang(file);
            
            documents.push({
              fileName: file,
              filePath: `/documentazione/${productType}/${file}`,
              category,
              productType,
              lang,
            });
          }
        }
      } catch (error) {
        // 如果目录不存在，跳过
        console.warn(`Directory ${dirPath} not found, skipping...`);
      }
    }
  } catch (error) {
    console.error('Error scanning documentazione directory:', error);
  }
  
  return documents;
}

export async function GET() {
  try {
    const documents = await scanDocumentazioneDirectory();
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error in documentazione API:', error);
    return NextResponse.json(
      { error: 'Failed to scan documents' },
      { status: 500 }
    );
  }
}

