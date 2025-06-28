"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconBuildingSkyscraper, IconChevronRight, IconMessageCircle, IconPlus, IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useBillingStore } from "@/store/useBillingStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ICustomPlanRequestInput } from "@/types/plan";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface CustomPlanRequestProps {
  className?: string;
  onRequestSubmit?: () => void;
}

const schema = yup
  .object({
    description: yup.string().required("Description is required"),
    companySize: yup.number().required("Company size is required"),
    features: yup.array().of(
      yup.object({
        name: yup.string().required("Feature name is required"),
        count: yup
          .number()
          .nullable()
          .transform((value) => (isNaN(value) ? null : value)),
      })
    ),
    limitations: yup.array().of(yup.string()),
  })
  .required();

export function CustomPlanRequest({ className }: CustomPlanRequestProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const requestCustomPlan = useBillingStore((store) => store.requestCustomPlan);
  const isRequestCustomPlanPending = useBillingStore((store) => store.isRequestCustomPlanPending);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      description: "",
      companySize: 0,
      features: [{ name: "", count: undefined }],
      limitations: [""],
    },
  });

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    await requestCustomPlan({
      description: data.description,
      companySize: data.companySize,
      features: data.features.reduce((acc, feature) => {
        acc[feature.name] = feature.count;
        return acc;
      }, {} as Record<string, number | undefined>),
      limitations: data.limitations,
    });
    reset();
    setIsFormOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className={cn("w-full", className)}>
      <Card>
        {!isFormOpen ? (
          <>
            <div className="rounded-full bg-primary/10 p-3 mx-auto">
              <IconBuildingSkyscraper className="size-8" />
            </div>

            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-xl ">Need a Custom Solution?</CardTitle>
              <CardDescription>Let us build a tailored plan that perfectly fits your business requirements</CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-center">
              <Button onClick={() => setIsFormOpen(true)} className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground group">
                Request Custom Plan
                <IconChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </>
        ) : (
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-xl font-bold text-center">Request Custom Plan</h3>

              <Input label="Company Size" type="number" {...register("companySize")} placeholder="How many employees do you have?" className="w-full" error={errors.companySize?.message} />

              <Textarea {...register("description")} placeholder="Tell us about your specific needs and requirements..." className="min-h-[120px] w-full" error={errors.description?.message} />

              <div className="space-y-2 flex flex-col items-end mb-8">
                <div className="flex gap-1 items-center justify-between w-full">
                  <Label className="text-base font-medium">Features</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setValue("features", [...watch("features"), { name: "", count: undefined }])} disabled={isRequestCustomPlanPending}>
                    <IconPlus /> Add Feature
                  </Button>
                </div>
                {watch("features").map((field, index) => (
                  <div key={index} className="flex items-start gap-2 w-full">
                    <Input {...register(`features.${index}.name`)} placeholder="Feature name" className="flex-grow" error={errors.features?.[index]?.name?.message} container={{ className: "w-full" }} />
                    <Input {...register(`features.${index}.count`)} type="number" placeholder="Count (optional)" className="w-32" error={errors.features?.[index]?.count?.message} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const features = [...watch("features")];
                        features.splice(index, 1);
                        setValue("features", features.length ? features : [{ name: "", count: undefined }]);
                      }}
                      disabled={watch("features").length === 1}
                    >
                      <IconTrash />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2 flex flex-col items-end mb-8 ">
                <div className="flex gap-1 items-center justify-between w-full mb-4">
                  <Label className="text-base font-medium">Limitations</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setValue("limitations", [...watch("limitations"), ""])} disabled={isRequestCustomPlanPending}>
                    <IconPlus /> Add Limitation
                  </Button>
                </div>

                {watch("limitations").map((field, index) => (
                  <div key={index} className="flex items-center gap-2 w-full">
                    <Input {...register(`limitations.${index}`)} placeholder="Limitation" className="flex-grow" error={errors.limitations?.[index]?.message} container={{ className: "w-full" }} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const limitations = [...watch("limitations")];
                        limitations.splice(index, 1);
                        setValue("limitations", limitations.length ? limitations : [""]);
                      }}
                      disabled={watch("limitations").length === 1}
                    >
                      <IconTrash />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>

                <Button type="submit" className="flex-1" loading={isRequestCustomPlanPending}>
                  <IconMessageCircle />
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
