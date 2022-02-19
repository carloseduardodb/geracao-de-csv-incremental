import { Injectable, Logger } from '@nestjs/common';
import { LineDto } from './dto/line.dto';
import * as Excel from 'exceljs';
import * as fs from 'fs';
import { readdir } from 'fs/promises';
import * as spread_sheet from 'spread_sheet';

@Injectable()
export class ArchiveService {
  async create(csvLine: LineDto, path) {
    const { promises } = fs;
    const { readdir } = promises;

    const archiveName = `CSV${new Date()
      .toISOString()
      .slice(0, 20)
      .replace(/\D/g, '')}.xlsx`;

    // Cria nova instancia do workbook
    var workbook = new Excel.Workbook();

    /**
     * Retorno em cascata
     * O retorno da linha de menor nivel sobe
     * até a linha de maior nível (que seria a linha abaixo)
     */
    return await readdir(path)
      .then(async (archives) => {
        const archiveExists = archives[0];
        const currentPath =
          archiveExists !== undefined
            ? path + archiveExists
            : path + archiveName;

        if (archiveExists) {
          // adiciona uma nova linha no csv
          const test = [
            [
              csvLine.id,
              csvLine.name,
              csvLine.description,
              csvLine.createdAt,
              csvLine.updatedAt,
            ],
          ];
          try {
            spread_sheet.addRow(
              test,
              currentPath,
              'Novo Usuário',
              function (err) {
                Logger.log(err);
                if (!err) {
                  Logger.log('success');
                  return {
                    archive_name: archiveName,
                    archive_exists: true,
                  };
                }
              },
            );
          } catch (err) {
            Logger.log(err);
          }
        } else {
          // Cria um novo arquivo excel
          var sheetName = 'Pessoas';
          var sheet = workbook.addWorksheet(sheetName);

          // Adiciona o header do arquivo
          sheet.columns = [
            { key: 'id', header: 'Identificação' },
            { key: 'name', header: 'Nome' },
            { key: 'description', header: 'Descrição' },
            { key: 'createdAt', header: 'Data de Criação' },
            { key: 'updatedAt', header: 'Data da Atualização' },
          ];

          // Adiciona dados no arquivo
          sheet.addRow(csvLine);
          var worksheet = workbook.getWorksheet(1);
          const row = worksheet.lastRow;
          row.addPageBreak();
          workbook.xlsx.writeFile(currentPath).then(function () {
            Logger.log('File is written');
          });
          return {
            archive_name: archiveName,
            archive_exists: false,
          };
        }
      })
      .catch((err: Error) => {
        /*Logger.log(err);
        throw new Error(
          `Impossivel abrir um diretorio inesistente! Detalhes do erro: ${err.message}`,
        );*/
      });
  }

  async test() {
    await readdir('./src/generate-archives/')
      .then(async (archives) => {
        const archiveExists = archives[0];
        Logger.log(archiveExists);
      })
      .catch((err) => {
        Logger.error(err);
      });
  }
}
