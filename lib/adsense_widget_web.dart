import 'package:flutter/material.dart';
import 'package:web/web.dart' as web;
// ignore: depend_on_referenced_packages
import 'dart:ui_web' as ui_web;

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
    final String viewType = 'adsense-view-$adSlot';

    ui_web.platformViewRegistry.registerViewFactory(viewType, (int viewId) {
      // CORREÇÃO: Usando o tipo genérico HTMLElement, que é o correto aqui.
      final ins = web.document.createElement('ins') as web.HTMLElement
        ..className = 'adsbygoogle'
        ..style.display = 'block'
        ..style.background = 'transparent'
        ..style.width = '100%'
        ..style.height = '100%'
        ..setAttribute('data-ad-client', adClient)
        ..setAttribute('data-ad-slot', adSlot);

      final script =
          web.document.createElement('script') as web.HTMLScriptElement
            ..src =
                'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
            ..async = true;

      final scriptPush =
          web.document.createElement('script') as web.HTMLScriptElement
            ..text = '(adsbygoogle = window.adsbygoogle || []).push({});';

      return web.document.createElement('div') as web.HTMLDivElement
        ..style.width = '100%'
        ..style.height = '100%'
        ..append(ins)
        ..append(script)
        ..append(scriptPush);
    });

    return HtmlElementView(viewType: viewType);
  }
}
