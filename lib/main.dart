import 'dart:async';
import 'dart:typed_data';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'adsense_widget_stub.dart'
    if (dart.library.html) 'adsense_widget_web.dart';
import 'package:image_picker/image_picker.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:screenshot/screenshot.dart';
import 'save_file_mobile.dart' if (dart.library.html) 'save_file_web.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const StudentCardApp());
}

class StudentCardApp extends StatelessWidget {
  const StudentCardApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gerador de Carteirinha',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
        fontFamily: 'Roboto',
        scaffoldBackgroundColor: const Color(0xFFF0F2F5),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1976D2),
          foregroundColor: Colors.white,
          elevation: 4,
          centerTitle: true,
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide.none,
          ),
          filled: true,
          fillColor: Colors.grey[100],
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 12,
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            backgroundColor: const Color(0xFF1976D2),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            foregroundColor: const Color(0xFF1976D2),
            side: const BorderSide(color: Color(0xFF1976D2)),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
      home: const CardGeneratorScreen(),
    );
  }
}

class CardGeneratorScreen extends StatefulWidget {
  const CardGeneratorScreen({super.key});

  @override
  State<CardGeneratorScreen> createState() => _CardGeneratorScreenState();
}

class _CardGeneratorScreenState extends State<CardGeneratorScreen> {
  final _nameController = TextEditingController(text: 'Nome do Aluno');
  final _courseController = TextEditingController(text: 'Curso do Aluno');
  final _rgmController = TextEditingController(text: '0000000-0');
  final _validityController = TextEditingController(text: '12/2027');
  final _universityNameController = TextEditingController(
    text: 'Nome da Universidade',
  );

  Uint8List? _studentImageBytes;
  Uint8List? _customUniversityLogoBytes;

  final List<String> _predefinedLogos = [
    'Nenhum',
    'HOGWARTS.png',
    'UFMG.png',
    'UFRJ.png',
    'UNESP.png',
    'USP.png',
  ];
  String _selectedPredefinedLogo = 'Nenhum';

  final _screenshotController = ScreenshotController();
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    _nameController.addListener(() => setState(() {}));
    _courseController.addListener(() => setState(() {}));
    _rgmController.addListener(() => setState(() {}));
    _validityController.addListener(() => setState(() {}));
    _universityNameController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _nameController.dispose();
    _courseController.dispose();
    _rgmController.dispose();
    _validityController.dispose();
    _universityNameController.dispose();
    super.dispose();
  }

  Future<void> _pickStudentImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      final bytes = await pickedFile.readAsBytes();
      setState(() {
        _studentImageBytes = bytes;
      });
    }
  }

  Future<void> _pickCustomUniversityLogo() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      final bytes = await pickedFile.readAsBytes();
      final image = await decodeImageFromList(bytes);

      if (image.width == 300 && image.height == 150) {
        setState(() {
          _customUniversityLogoBytes = bytes;
          _selectedPredefinedLogo = 'Nenhum';
        });
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('O logo da universidade deve ter 300x150 pixels.'),
              backgroundColor: Colors.red,
            ),
          );
        }
        setState(() {
          _customUniversityLogoBytes = null;
        });
      }
    } else {
      setState(() {
        _customUniversityLogoBytes = null;
      });
    }
  }

  Future<void> _showAdAndDownload(Function downloadFunction) async {
    // Com os anúncios de vinheta ativados no index.html, o Google gerencia a exibição.
    // Nós simplesmente executamos o download. O AdSense pode interceptar essa ação
    // para exibir um anúncio, se julgar apropriado.
    downloadFunction();
  }

  Future<void> _downloadAsPng() async {
    final imageBytes = await _screenshotController.capture(
      delay: const Duration(milliseconds: 10),
      pixelRatio: 3.0,
    );
    if (imageBytes != null) {
      await saveFile(imageBytes, 'png');
    }
  }

  Future<void> _downloadAsPdf() async {
    final imageBytes = await _screenshotController.capture(pixelRatio: 3.0);
    if (imageBytes == null) return;

    final pdf = pw.Document();
    final image = pw.MemoryImage(imageBytes);

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Center(
            child: pw.Column(
              mainAxisAlignment: pw.MainAxisAlignment.center,
              children: [
                pw.Text(
                  'Carteirinha de Estudante',
                  style: pw.TextStyle(
                    fontSize: 24,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),
                pw.SizedBox(height: 20),
                pw.SizedBox(width: 350, child: pw.Image(image)),
                pw.SizedBox(height: 20),
                pw.Text(
                  'Gerado por Gerador de Carteirinha App',
                  style: const pw.TextStyle(
                    fontSize: 12,
                    color: PdfColors.grey,
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );

    final pdfBytes = await pdf.save();
    await saveFile(pdfBytes, 'pdf');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Gerador de Carteirinha')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (kIsWeb)
              Column(
                children: [
                  const SizedBox(height: 284),
                  SizedBox(
                    width: 200,
                    height: 600,
                    child: AdsenseWidget(
                      adClient: 'ca-pub-6382507327811351',
                      adSlot: '6916028297',
                    ),
                  ),
                ],
              ),
            if (kIsWeb) const SizedBox(width: 24),
            Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 500),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    _buildCardPreview(),
                    const SizedBox(height: 24),
                    _buildForm(),
                    const SizedBox(height: 24),
                    _buildAdOrDownloadSection(),
                  ],
                ),
              ),
            ),
            if (kIsWeb) const SizedBox(width: 24),
            if (kIsWeb)
              Column(
                children: [
                  const SizedBox(height: 284),

                  SizedBox(
                    width: 200,
                    height: 600,
                    child: AdsenseWidget(
                      adClient: 'ca-pub-6382507327811351',
                      adSlot: '7330961262',
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildCardPreview() {
    final ImageProvider? universityLogoImageProvider =
        _customUniversityLogoBytes != null
        ? MemoryImage(_customUniversityLogoBytes!)
        : (_selectedPredefinedLogo != 'Nenhum'
              ? AssetImage('assets/logos/$_selectedPredefinedLogo')
              : null);

    Widget? watermarkLogo;
    if (_customUniversityLogoBytes != null) {
      watermarkLogo = Image.memory(
        _customUniversityLogoBytes!,
        fit: BoxFit.contain,
      );
    } else if (_selectedPredefinedLogo != 'Nenhum') {
      watermarkLogo = Image.asset(
        'assets/logos/$_selectedPredefinedLogo',
        fit: BoxFit.contain,
      );
    }

    return Screenshot(
      controller: _screenshotController,
      child: Container(
        width: 450,
        height: 260,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16.0),
          child: Stack(
            children: [
              Positioned.fill(
                child: CustomPaint(painter: RhombusPatternPainter()),
              ),
              if (watermarkLogo != null)
                Positioned.fill(
                  child: Center(
                    child: FractionallySizedBox(
                      widthFactor: 0.95,
                      heightFactor: 0.95,
                      child: Padding(
                        padding: const EdgeInsets.only(left: 15.0),
                        child: Opacity(
                          opacity: 0.05,
                          child: ColorFiltered(
                            colorFilter: const ColorFilter.mode(
                              Colors.grey,
                              BlendMode.saturation,
                            ),
                            child: watermarkLogo,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'ESTUDANTE',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.grey,
                                letterSpacing: 1.5,
                              ),
                            ),
                            Text(
                              _universityNameController.text.isEmpty
                                  ? 'Nome da Universidade'
                                  : _universityNameController.text
                                        .toUpperCase(),
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF444444),
                              ),
                            ),
                          ],
                        ),
                        if (universityLogoImageProvider != null)
                          SizedBox(
                            width: 90,
                            height: 35,
                            child: Image(
                              image: universityLogoImageProvider,
                              fit: BoxFit.contain,
                            ),
                          ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: Container(height: 1, color: Colors.grey[200]),
                    ),
                    Expanded(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Container(
                            width: 112,
                            height: 112,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 4),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  blurRadius: 5,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: CircleAvatar(
                              radius: 52,
                              backgroundColor: Colors.grey[200],
                              backgroundImage: _studentImageBytes != null
                                  ? MemoryImage(_studentImageBytes!)
                                  : null,
                              child: _studentImageBytes == null
                                  ? Icon(
                                      Icons.person,
                                      size: 60,
                                      color: Colors.grey[400],
                                    )
                                  : null,
                            ),
                          ),
                          const SizedBox(width: 20),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  _nameController.text.isEmpty
                                      ? 'Nome do Aluno'
                                      : _nameController.text,
                                  style: const TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF333333),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  _courseController.text.isEmpty
                                      ? 'Curso do Aluno'
                                      : _courseController.text,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    color: Color(0xFF666666),
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Row(
                                  children: [
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          'RGM',
                                          style: TextStyle(
                                            fontSize: 10,
                                            color: Colors.grey,
                                          ),
                                        ),
                                        Text(
                                          _rgmController.text.isEmpty
                                              ? '0000000-0'
                                              : _rgmController.text,
                                          style: const TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF333333),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(width: 24),
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          'VALIDADE',
                                          style: TextStyle(
                                            fontSize: 10,
                                            color: Colors.grey,
                                          ),
                                        ),
                                        Text(
                                          _validityController.text.isEmpty
                                              ? '12/2027'
                                              : _validityController.text,
                                          style: const TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF333333),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildForm() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Informações',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const Divider(height: 24, thickness: 1, color: Colors.grey),
          _buildTextField('Nome Completo', _nameController, 'Ex: Ana Silva'),
          const SizedBox(height: 12),
          _buildTextField('Curso', _courseController, 'Ex: Design Gráfico'),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildTextField(
                  'RGM / Matrícula',
                  _rgmController,
                  'Ex: 1234567-8',
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildTextField(
                  'Validade',
                  _validityController,
                  'Ex: 12/2027',
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildTextField(
            'Nome da Universidade',
            _universityNameController,
            'Ex: Universidade Criativa',
          ),
          const SizedBox(height: 24),
          const Text(
            'Imagens',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const Divider(height: 24, thickness: 1, color: Colors.grey),
          _buildImagePickerButton(
            'Foto do Aluno',
            _studentImageBytes != null ? 'Foto escolhida' : 'Escolher arquivo',
            _pickStudentImage,
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            value: _selectedPredefinedLogo,
            decoration: const InputDecoration(
              labelText: 'Logo da Universidade (da lista)',
            ),
            items: _predefinedLogos.map((String logoName) {
              return DropdownMenuItem<String>(
                value: logoName,
                child: Text(
                  logoName == 'Nenhum'
                      ? 'Nenhum logo da lista'
                      : logoName
                            .replaceAll('.png', '')
                            .replaceAll('-', ' ')
                            .toUpperCase(),
                ),
              );
            }).toList(),
            onChanged: (String? newValue) {
              setState(() {
                _selectedPredefinedLogo = newValue!;
                if (newValue != 'Nenhum') {
                  _customUniversityLogoBytes = null;
                  _universityNameController.text = newValue
                      .replaceAll('.png', '')
                      .replaceAll('-', ' ')
                      .toUpperCase();
                } else {
                  _universityNameController.clear();
                }
              });
            },
          ),
          const SizedBox(height: 12),
          if (_selectedPredefinedLogo == 'Nenhum')
            _buildImagePickerButton(
              'Upload de Logo da Universidade (Opcional)',
              _customUniversityLogoBytes != null
                  ? 'Logo personalizado escolhido'
                  : 'Escolher arquivo',
              _pickCustomUniversityLogo,
              tooltip:
                  'Formato: PNG. Tamanho recomendado: 300x150 pixels (largura x altura).',
            ),
        ],
      ),
    );
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller,
    String hintText,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.grey,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          decoration: InputDecoration(hintText: hintText),
        ),
      ],
    );
  }

  Widget _buildImagePickerButton(
    String label,
    String buttonText,
    Future<void> Function() onPressed, {
    String? tooltip,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
            ),
            if (tooltip != null) ...[
              const SizedBox(width: 8),
              Tooltip(
                message: tooltip,
                child: const Icon(
                  Icons.info_outline,
                  size: 16,
                  color: Colors.grey,
                ),
              ),
            ],
          ],
        ),
        const SizedBox(height: 8),
        Container(
          height: 48,
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey[300]!),
          ),
          child: Row(
            children: [
              TextButton(
                onPressed: onPressed,
                style: TextButton.styleFrom(
                  backgroundColor: Colors.grey[200],
                  foregroundColor: Colors.black87,
                  shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(8),
                      bottomLeft: Radius.circular(8),
                    ),
                  ),
                ),
                child: const Text('Escolher arquivo'),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  buttonText,
                  style: TextStyle(color: Colors.grey[600]),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAdOrDownloadSection() {
    return Column(
      children: [
        ElevatedButton(
          onPressed: () => _downloadAsPng(),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.image),
              SizedBox(width: 8),
              Text('Baixar Carteirinha (PNG)'),
            ],
          ),
        ),
        const SizedBox(height: 12),
        OutlinedButton(
          onPressed: () => _downloadAsPdf(),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.picture_as_pdf),
              SizedBox(width: 8),
              Text('Baixar Carteirinha (PDF)'),
            ],
          ),
        ),
      ],
    );
  }
}

class RhombusPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.grey[100]!.withOpacity(0.4)
      ..style = PaintingStyle.fill;

    const double width = 20;
    const double height = 20;

    for (double y = -height; y < size.height + height; y += height) {
      for (double x = -width; x < size.width + width; x += width) {
        final double xOffset = (y / height) % 2 == 0 ? 0 : width / 2;

        final path = Path();
        path.moveTo(x + xOffset, y + height / 2);
        path.lineTo(x + xOffset + width / 2, y);
        path.lineTo(x + xOffset + width, y + height / 2);
        path.lineTo(x + xOffset + width / 2, y + height);
        path.close();
        canvas.drawPath(path, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
