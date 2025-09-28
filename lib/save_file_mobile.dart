import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:open_file/open_file.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';

Future<void> saveFile(Uint8List fileBytes, String extension) async {
  // Pede a permissão de armazenamento moderna para Android
  var status = await Permission.manageExternalStorage.request();

  if (status.isGranted) {
    try {
      final directory = await getExternalStorageDirectory();
      if (directory != null) {
        final filePath =
            '${directory.path}/carteirinha_estudante_${DateTime.now().millisecondsSinceEpoch}.$extension';
        final file = File(filePath);
        await file.writeAsBytes(fileBytes);

        // ALTERAÇÃO: Garante que esta linha só execute em plataformas não-web
        if (!kIsWeb) {
          OpenFile.open(filePath);
        }
      }
    } catch (e) {
      debugPrint('Erro ao salvar arquivo no mobile: $e');
    }
  } else {
    debugPrint('Permissão para gerenciar armazenamento foi negada.');
  }
}
