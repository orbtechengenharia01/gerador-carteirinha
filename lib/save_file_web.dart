import 'dart:html' as html;
import 'package:flutter/foundation.dart';

Future<void> saveFile(Uint8List fileBytes, String extension) async {
  final blob = html.Blob([fileBytes]);
  final url = html.Url.createObjectUrlFromBlob(blob);
  final anchor = html.AnchorElement(href: url)
    ..setAttribute("download", "carteirinha-de-estudante.$extension")
    ..click();
  html.Url.revokeObjectUrl(url);
}
