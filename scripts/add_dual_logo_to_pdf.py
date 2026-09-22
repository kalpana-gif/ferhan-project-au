from io import BytesIO
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "output" / "pdf" / "codex-scroll-video-component-prompt.pdf"
TEMP_PATH = PDF_PATH.with_suffix(".logo-update.pdf")

PAGE_W, PAGE_H = A4
INK = colors.HexColor("#121212")
PAPER = colors.HexColor("#F6F4EF")
MUTED = colors.HexColor("#66625C")
WHITE = colors.white


def draw_logo_pair(pdf_canvas, x, y, color, scale=1.0):
    mark_height = 4.2 * mm * scale
    rectangle_width = 13 * mm * scale
    gap = 5 * mm * scale
    menu_width = 13.5 * mm * scale
    menu_x = x + rectangle_width + gap

    pdf_canvas.saveState()
    pdf_canvas.setStrokeColor(color)
    pdf_canvas.setLineWidth(max(0.65, 0.9 * scale))
    pdf_canvas.setLineCap(0)
    pdf_canvas.rect(x, y, rectangle_width, mark_height, stroke=1, fill=0)
    pdf_canvas.line(menu_x, y + mark_height, menu_x + menu_width, y + mark_height)
    pdf_canvas.line(menu_x, y + mark_height / 2, menu_x + menu_width, y + mark_height / 2)
    pdf_canvas.line(menu_x, y, menu_x + menu_width, y)
    pdf_canvas.restoreState()


def make_overlay(page_number):
    stream = BytesIO()
    overlay = canvas.Canvas(stream, pagesize=A4)

    if page_number == 1:
        draw_logo_pair(overlay, PAGE_W - 51 * mm, PAGE_H - 22 * mm, WHITE)
    else:
        overlay.setFillColor(PAPER)
        overlay.rect(19.5 * mm, PAGE_H - 13.6 * mm, 31 * mm, 6.5 * mm, stroke=0, fill=1)
        draw_logo_pair(overlay, 20 * mm, PAGE_H - 11.6 * mm, MUTED, scale=0.55)
        overlay.setFillColor(MUTED)
        overlay.setFont("Helvetica-Bold", 7)
        overlay.drawString(40 * mm, PAGE_H - 10.5 * mm, "CODEX PLAYBOOK")

    overlay.save()
    stream.seek(0)
    return PdfReader(stream).pages[0]


def main():
    reader = PdfReader(str(PDF_PATH))
    writer = PdfWriter()

    for page_number, page in enumerate(reader.pages, start=1):
        page.merge_page(make_overlay(page_number))
        writer.add_page(page)

    writer.add_metadata(reader.metadata or {})
    with TEMP_PATH.open("wb") as output:
        writer.write(output)
    TEMP_PATH.replace(PDF_PATH)
    print(PDF_PATH)


if __name__ == "__main__":
    main()
