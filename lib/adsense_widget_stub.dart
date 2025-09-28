import 'package:flutter/material.dart';

class AdsenseWidget extends StatelessWidget {
  final String adClient;
  final String adSlot;

  const AdsenseWidget({
    super.key,
    required this.adClient,
    required this.adSlot,
  });

  @override
  Widget build(BuildContext context) {
    // Retorna um widget vazio para plataformas não-web
    return const SizedBox.shrink();
  }
}
