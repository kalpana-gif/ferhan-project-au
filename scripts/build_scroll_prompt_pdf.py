from pathlib import Path
import re
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "CODEX_SCROLL_VIDEO_COMPONENT_PROMPT.md"
OUTPUT = ROOT / "output" / "pdf" / "codex-scroll-video-component-prompt.pdf"

PAGE_W, PAGE_H = A4
INK = colors.HexColor("#121212")
PAPER = colors.HexColor("#F6F4EF")
MUTED = colors.HexColor("#66625C")
LINE = colors.HexColor("#D8D3C9")
ACCENT = colors.HexColor("#C8752B")
WHITE = colors.white


def draw_logo_pair(canvas, x, y, color, scale=1.0):
    """Draw the two supplied outline marks as a crisp vector lockup."""
    mark_height = 4.2 * mm * scale
    rectangle_width = 13 * mm * scale
    gap = 5 * mm * scale
    menu_width = 13.5 * mm * scale
    menu_x = x + rectangle_width + gap

    canvas.saveState()
    canvas.setStrokeColor(color)
    canvas.setLineWidth(max(0.65, 0.9 * scale))
    canvas.setLineCap(0)
    canvas.rect(x, y, rectangle_width, mark_height, stroke=1, fill=0)
    canvas.line(menu_x, y + mark_height, menu_x + menu_width, y + mark_height)
    canvas.line(menu_x, y + mark_height / 2, menu_x + menu_width, y + mark_height / 2)
    canvas.line(menu_x, y, menu_x + menu_width, y)
    canvas.restoreState()


def ascii_safe(value: str) -> str:
    return (
        value.replace("—", "-")
        .replace("–", "-")
        .replace("×", "x")
        .replace("’", "'")
        .replace("“", '"')
        .replace("”", '"')
    )


def rich(value: str) -> str:
    value = escape(ascii_safe(value))
    value = re.sub(r"(\[[^\]]+\])", rf'<font color="{ACCENT.hexval()}"><b>\1</b></font>', value)
    value = re.sub(r"^([^:]{1,34}:)(\s+)", r"<b>\1</b>\2", value)
    return value


class PromptDocTemplate(BaseDocTemplate):
    def __init__(self, filename: str):
        super().__init__(
            filename,
            pagesize=A4,
            leftMargin=20 * mm,
            rightMargin=20 * mm,
            topMargin=21 * mm,
            bottomMargin=19 * mm,
            title="Codex Prompt - Premium Scroll-Controlled Video Component",
            author="F3 Design",
            subject="Reusable Codex implementation prompt",
        )

        cover_frame = Frame(20 * mm, 18 * mm, PAGE_W - 40 * mm, PAGE_H - 36 * mm, id="cover", showBoundary=0)
        body_frame = Frame(20 * mm, 19 * mm, PAGE_W - 40 * mm, PAGE_H - 40 * mm, id="body", showBoundary=0)
        self.addPageTemplates([
            PageTemplate(id="cover", frames=[cover_frame], onPage=self.draw_cover),
            PageTemplate(id="body", frames=[body_frame], onPage=self.draw_body),
        ])

    def draw_cover(self, canvas, doc):
        canvas.saveState()
        canvas.setFillColor(INK)
        canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
        canvas.setFillColor(ACCENT)
        canvas.rect(0, PAGE_H - 5 * mm, PAGE_W, 5 * mm, stroke=0, fill=1)
        draw_logo_pair(canvas, PAGE_W - 51 * mm, PAGE_H - 22 * mm, WHITE)
        canvas.restoreState()

    def draw_body(self, canvas, doc):
        canvas.saveState()
        canvas.setFillColor(PAPER)
        canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.5)
        canvas.line(20 * mm, PAGE_H - 14 * mm, PAGE_W - 20 * mm, PAGE_H - 14 * mm)
        draw_logo_pair(canvas, 20 * mm, PAGE_H - 11.6 * mm, MUTED, scale=0.55)
        canvas.setFont("Helvetica-Bold", 7)
        canvas.setFillColor(MUTED)
        canvas.drawString(40 * mm, PAGE_H - 10.5 * mm, "CODEX PLAYBOOK")
        canvas.setFont("Helvetica", 7)
        canvas.drawRightString(PAGE_W - 20 * mm, PAGE_H - 10.5 * mm, "SCROLL-CONTROLLED VIDEO")
        canvas.setStrokeColor(LINE)
        canvas.line(20 * mm, 13 * mm, PAGE_W - 20 * mm, 13 * mm)
        canvas.setFont("Helvetica", 7)
        canvas.drawString(20 * mm, 8.7 * mm, "F3 DESIGN / REUSABLE IMPLEMENTATION BRIEF")
        canvas.drawRightString(PAGE_W - 20 * mm, 8.7 * mm, f"{doc.page:02d}")
        canvas.restoreState()


styles = getSampleStyleSheet()
cover_kicker = ParagraphStyle(
    "CoverKicker", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8,
    leading=10, textColor=ACCENT, tracking=2.1, spaceAfter=15 * mm,
)
cover_title = ParagraphStyle(
    "CoverTitle", parent=styles["Title"], fontName="Helvetica", fontSize=39,
    leading=41, textColor=WHITE, alignment=TA_LEFT, spaceAfter=9 * mm,
)
cover_deck = ParagraphStyle(
    "CoverDeck", parent=styles["Normal"], fontName="Helvetica", fontSize=13,
    leading=19, textColor=colors.HexColor("#CFCFCF"), spaceAfter=13 * mm,
)
cover_chip = ParagraphStyle(
    "CoverChip", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=7.5,
    leading=9, textColor=WHITE, borderColor=colors.HexColor("#555555"), borderWidth=0.6,
    borderRadius=11, borderPadding=(5, 9, 5, 9), spaceAfter=4 * mm,
)
doc_title = ParagraphStyle(
    "DocTitle", parent=styles["Heading1"], fontName="Helvetica", fontSize=25,
    leading=28, textColor=INK, spaceAfter=5 * mm,
)
lead = ParagraphStyle(
    "Lead", parent=styles["BodyText"], fontName="Helvetica", fontSize=11,
    leading=16, textColor=MUTED, spaceAfter=10 * mm,
)
section_style = ParagraphStyle(
    "Section", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=10,
    leading=12, textColor=ACCENT, tracking=1.5, spaceBefore=7 * mm, spaceAfter=3 * mm,
    keepWithNext=True,
)
body_style = ParagraphStyle(
    "Body", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.2,
    leading=13.2, textColor=INK, spaceAfter=2.6 * mm,
)
bullet_style = ParagraphStyle(
    "Bullet", parent=body_style, leftIndent=5 * mm, firstLineIndent=-3.5 * mm,
    bulletIndent=0, spaceAfter=2.2 * mm,
)
number_style = ParagraphStyle(
    "Number", parent=body_style, leftIndent=7 * mm, firstLineIndent=-6 * mm,
    bulletIndent=0, spaceAfter=2.5 * mm,
)
short_style = ParagraphStyle(
    "Short", parent=styles["BodyText"], fontName="Helvetica", fontSize=10.2,
    leading=15.2, textColor=INK,
)


def prompt_flowables(prompt: str):
    flowables = []
    lines = [ascii_safe(line.rstrip()) for line in prompt.strip().splitlines()]
    for line in lines:
        stripped = line.strip()
        if not stripped:
            flowables.append(Spacer(1, 1.7 * mm))
            continue
        if stripped.isupper() and len(stripped) < 40:
            flowables.append(Paragraph(escape(stripped), section_style))
            continue
        numbered = re.match(r"^(\d+)\.\s+(.*)$", stripped)
        if numbered:
            flowables.append(Paragraph(rich(numbered.group(2)), number_style, bulletText=f"{numbered.group(1)}."))
            continue
        if stripped.startswith("- "):
            flowables.append(Paragraph(rich(stripped[2:]), bullet_style, bulletText="•"))
            continue
        flowables.append(Paragraph(rich(stripped), body_style))
    return flowables


def main():
    source = SOURCE.read_text(encoding="utf-8")
    prompts = re.findall(r"```text\n(.*?)```", source, flags=re.S)
    if len(prompts) != 2:
        raise ValueError("Expected a full prompt and a short prompt in the source markdown")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    story = [
        Spacer(1, 26 * mm),
        Paragraph("CODEX / REUSABLE BUILD PROMPT", cover_kicker),
        Paragraph("Premium scroll-<br/>controlled video<br/>component", cover_title),
        Paragraph(
            "A production-ready brief for building cinematic, responsive, high-resolution video sequences controlled by natural page scroll.",
            cover_deck,
        ),
        Spacer(1, 10 * mm),
        Paragraph("SMOOTH BIDIRECTIONAL SCRUBBING", cover_chip),
        Paragraph("ADAPTIVE 8K / 4K / MOBILE MEDIA", cover_chip),
        Paragraph("ACCESSIBLE + PERFORMANCE-AWARE", cover_chip),
        Spacer(1, 30 * mm),
        Paragraph("Version 1.0 &nbsp;&nbsp;/&nbsp;&nbsp; Ready to copy into Codex", ParagraphStyle(
            "CoverMeta", parent=cover_deck, fontSize=8, leading=10, textColor=colors.HexColor("#888888")
        )),
        NextPageTemplate("body"),
        PageBreak(),
        Paragraph("Master implementation prompt", doc_title),
        Paragraph(
            "Replace the highlighted square-bracket fields, attach the reference media, and send the completed prompt to Codex from the target repository.",
            lead,
        ),
    ]
    story.extend(prompt_flowables(prompts[0]))
    story.extend([
        PageBreak(),
        Paragraph("Short copy-paste version", doc_title),
        Paragraph("Use this version when the repository already has clear conventions and the desired placement is known.", lead),
    ])
    short_rows = [
        [Paragraph(rich(paragraph), short_style)]
        for paragraph in [p.strip() for p in prompts[1].strip().split("\n\n") if p.strip()]
    ]
    short_table = Table(short_rows, colWidths=[166 * mm], hAlign="CENTER")
    short_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.6, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 7 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 6 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6 * mm),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(short_table)

    document = PromptDocTemplate(str(OUTPUT))
    document.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    main()
