import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { AppData } from '@/types';

export const exportToCSV = (data: AppData) => {
  const selectedSummary = (data.summaries || []).find(s => s.isSelected);
  const selectedBullets = (data.bullets || []).filter(b => b.isSelected);
  const visibleCompanies = (data.companies || []).filter(c => (c as any).isVisible !== false);

  let csv = 'Section,Content\n';
  
  // Add summary
  if (selectedSummary) {
    csv += `Summary,"${selectedSummary.content.replace(/"/g, '""')}"\n`;
  }

  // Add work experience
  visibleCompanies.forEach(company => {
    company.positions.forEach(position => {
      csv += `\nCompany,"${company.name}"\n`;
      csv += `Position,"${position.title}"\n`;
      csv += `Dates,"${position.startDate} - ${position.endDate || 'Present'}"\n`;
      
      position.projects.forEach(project => {
        const projectBullets = selectedBullets.filter(b => b.projectId === project.id);
        if (projectBullets.length > 0) {
          csv += `Project,"${project.name}"\n`;
          projectBullets.forEach(bullet => {
            csv += `Bullet,"${bullet.content.replace(/"/g, '""')}"\n`;
          });
        }
      });
    });
  });

  // Add education
  (data.education || []).forEach(edu => {
    csv += `\nEducation,"${edu.degree}"\n`;
    csv += `Institution,"${edu.institution}"\n`;
    csv += `Dates,"${edu.startDate} - ${edu.endDate || 'Present'}"\n`;
  });

  // Add skills
  if ((data.skills || []).length > 0) {
    csv += `\nSkills,"${(data.skills || []).map(s => s.name).join(', ')}"\n`;
  }

  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToPDF = (data: AppData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('John Doe', 20, yPos);
  yPos += 7;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('john.doe@email.com • (555) 123-4567 • San Francisco, CA', 20, yPos);
  yPos += 10;

  // Line
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  const selectedSummary = (data.summaries || []).find(s => s.isSelected);
  const selectedBullets = (data.bullets || []).filter(b => b.isSelected);
  const visibleCompanies = (data.companies || []).filter(c => (c as any).isVisible !== false);

  // Summary
  if (selectedSummary) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 20, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(selectedSummary.content, pageWidth - 40);
    doc.text(summaryLines, 20, yPos);
    yPos += summaryLines.length * 5 + 5;
  }

  // Work Experience
  if (visibleCompanies.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Work Experience', 20, yPos);
    yPos += 7;

    visibleCompanies.forEach(company => {
      company.positions.forEach(position => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(company.name, 20, yPos);
        
        doc.setFont('helvetica', 'normal');
        const dateText = `${position.startDate} - ${position.endDate || 'Present'}`;
        doc.text(dateText, pageWidth - 20 - doc.getTextWidth(dateText), yPos);
        yPos += 5;

        doc.setFont('helvetica', 'bold');
        doc.text(position.title, 20, yPos);
        yPos += 7;

        position.projects.forEach(project => {
          const projectBullets = selectedBullets.filter(b => b.projectId === project.id);
          if (projectBullets.length > 0 && (project as any).isVisible !== false) {
            doc.setFont('helvetica', 'italic');
            doc.text(project.name, 20, yPos);
            yPos += 5;
          }

          projectBullets.forEach(bullet => {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }

            doc.setFont('helvetica', 'normal');
            const bulletLines = doc.splitTextToSize(`• ${bullet.content}`, pageWidth - 45);
            doc.text(bulletLines, 25, yPos);
            yPos += bulletLines.length * 5;
          });
        });
        
        yPos += 3;
      });
    });
  }

  // Education
  if ((data.education || []).length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Education', 20, yPos);
    yPos += 7;

    (data.education || []).forEach(edu => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(edu.degree, 20, yPos);
      
      doc.setFont('helvetica', 'normal');
      const dateText = `${edu.startDate} - ${edu.endDate || 'Present'}`;
      doc.text(dateText, pageWidth - 20 - doc.getTextWidth(dateText), yPos);
      yPos += 5;

      doc.text(edu.institution, 20, yPos);
      yPos += 7;
    });
  }

  // Skills
  if ((data.skills || []).length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Skills', 20, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const skillsText = (data.skills || []).map(s => s.name).join(', ');
    const skillsLines = doc.splitTextToSize(skillsText, pageWidth - 40);
    doc.text(skillsLines, 20, yPos);
  }

  doc.save('resume.pdf');
};

export const exportToDOCX = async (data: AppData) => {
  const selectedSummary = (data.summaries || []).find(s => s.isSelected);
  const selectedBullets = (data.bullets || []).filter(b => b.isSelected);
  const visibleCompanies = (data.companies || []).filter(c => (c as any).isVisible !== false);

  const children: any[] = [];

  // Header
  children.push(
    new Paragraph({
      text: 'John Doe',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: 'john.doe@email.com • (555) 123-4567 • San Francisco, CA',
      spacing: { after: 200 },
    }),
    new Paragraph({
      border: {
        top: {
          color: '000000',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      spacing: { after: 200 },
    })
  );

  // Summary
  if (selectedSummary) {
    children.push(
      new Paragraph({
        text: 'Summary',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: selectedSummary.content,
        spacing: { after: 200 },
      })
    );
  }

  // Work Experience
  if (visibleCompanies.length > 0) {
    children.push(
      new Paragraph({
        text: 'Work Experience',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      })
    );

    visibleCompanies.forEach(company => {
      company.positions.forEach(position => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: company.name,
                bold: true,
              }),
              new TextRun({
                text: `\t${position.startDate} - ${position.endDate || 'Present'}`,
              }),
            ],
            spacing: { after: 50 },
          }),
      new Paragraph({
        children: [
          new TextRun({
            text: position.title,
            bold: true,
          }),
        ],
        spacing: { after: 100 },
      })
        );

        position.projects.forEach(project => {
          const projectBullets = selectedBullets.filter(b => b.projectId === project.id);
          
          if (projectBullets.length > 0 && (project as any).isVisible !== false) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: project.name,
                    italics: true,
                  }),
                ],
                spacing: { after: 50 },
              })
            );
          }

          projectBullets.forEach(bullet => {
            children.push(
              new Paragraph({
                text: `• ${bullet.content}`,
                spacing: { after: 50 },
                indent: { left: 360 },
              })
            );
          });
        });

        children.push(
          new Paragraph({
            text: '',
            spacing: { after: 100 },
          })
        );
      });
    });
  }

  // Education
  if ((data.education || []).length > 0) {
    children.push(
      new Paragraph({
        text: 'Education',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      })
    );

    (data.education || []).forEach(edu => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.degree,
              bold: true,
            }),
            new TextRun({
              text: `\t${edu.startDate} - ${edu.endDate || 'Present'}`,
            }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: edu.institution,
          spacing: { after: 100 },
        })
      );
    });
  }

  // Skills
  if ((data.skills || []).length > 0) {
    children.push(
      new Paragraph({
        text: 'Skills',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: (data.skills || []).map(s => s.name).join(', '),
        spacing: { after: 100 },
      })
    );
  }

  const doc = new Document({
    sections: [{
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume.docx';
  a.click();
  window.URL.revokeObjectURL(url);
};
