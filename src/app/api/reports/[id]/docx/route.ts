import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildReportDocx } from "@/lib/docx";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const rows = await db().query(
    `SELECT r.title,r.current_version,rv.content,p.code
     FROM reports r
     JOIN projects p ON p.id=r.project_id
     JOIN report_versions rv ON rv.report_id=r.id AND rv.version=r.current_version
     WHERE r.id=$1 AND p.organization_id=$2
     LIMIT 1`,
    [id, user.organization_id]
  );
  const report = rows[0] as { title: string; current_version: number; content: unknown; code: string } | undefined;
  if (!report) return Response.json({ error: "Rapport introuvable" }, { status: 404 });

  const docx = buildReportDocx(report.content as Parameters<typeof buildReportDocx>[0]);
  const base = `${report.code}-V${report.current_version}`.replace(/[^A-Za-z0-9._-]+/g, "-");
  return new Response(new Uint8Array(docx), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": `attachment; filename="${base}.docx"`,
      "cache-control": "private, no-store",
    },
  });
}
